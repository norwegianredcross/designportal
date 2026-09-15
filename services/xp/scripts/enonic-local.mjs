/** Run Enonic with designportal's own lifecycle state and management endpoint. */
import { mkdirSync, readFileSync, realpathSync, existsSync, copyFileSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const binding = readFileSync(join(projectDir, ".enonic"), "utf8").match(/^sandbox\s*=\s*"([\w-]+)"/m)?.[1];
if (!binding || binding === "rodekors") {
  throw new Error('Bind this project to its own sandbox first: enonic project sandbox designportal');
}
const sandbox = join(homedir(), ".enonic", "sandboxes", binding);
const xpHome = realpathSync(join(sandbox, "home"));
const referenceHome = join(homedir(), ".enonic", "sandboxes", "rodekors", "home");
if (existsSync(referenceHome) && xpHome === realpathSync(referenceHome)) {
  throw new Error("Designportal must have its own XP home directory.");
}
const jetty = readFileSync(join(xpHome, "config/com.enonic.xp.web.jetty.cfg"), "utf8");
for (const [key, value] of Object.entries({
  "http.xp.port": "8081", "http.management.port": "4849", "http.monitor.port": "2610",
  "session.cookieName": "DESIGNPORTAL_SESSION",
})) {
  const actual = jetty.match(new RegExp(`^${key.replaceAll('.', '\\.')}\\s*=\\s*(\\S+)`, "m"))?.[1];
  if (actual !== value) throw new Error(`Set ${key} = ${value} in ${xpHome}/config/com.enonic.xp.web.jetty.cfg`);
}
const cliHome = resolve(projectDir, "../../.local/enonic-cli");
const stateRoot = join(cliHome, ".enonic");
const localSandbox = join(stateRoot, "sandboxes", binding);
mkdirSync(localSandbox, { recursive: true });
// Only SDK binaries are shared. CLI state is private, and the sandbox's
// existing data stays at its original path; no database copy or dump needed.
for (const [link, target] of [
  [join(stateRoot, "distributions"), join(homedir(), ".enonic/distributions")],
  [join(localSandbox, "home"), xpHome],
]) {
  if (!existsSync(link)) symlinkSync(target, link, "dir");
  if (realpathSync(link) !== realpathSync(target)) throw new Error(`Unexpected CLI path: ${link}`);
}
copyFileSync(join(sandbox, ".enonic"), join(localSandbox, ".enonic"));
const args = process.argv.slice(2);
if (!args.length) throw new Error("Usage: npm run enonic -- <command>; e.g. sandbox list");
const options = {
  cwd: projectDir,
  stdio: "inherit",
  env: {
    ...process.env,
    ENONIC_CLI_HOME_PATH: cliHome,
    ENONIC_CLI_REMOTE_URL: "http://localhost:4849",
    XP_HOME: xpHome,
    JAVA_DEBUG_OPTS: "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=127.0.0.1:5006",
  },
};
if (args[0] === "dev") {
  const stateFile = join(stateRoot, ".enonic");
  const state = existsSync(stateFile) ? readFileSync(stateFile, "utf8") : "";
  const pid = Number(state.match(/^PID\s*=\s*(\d+)/m)?.[1]);
  let running = false;
  if (pid > 0 && state.includes(`running = "${binding}"`)) {
    try { process.kill(pid, 0); running = true; } catch { /* stale CLI state */ }
  }
  if (!running) {
    // The CLI's dev command has no HTTP-port option. Start explicitly so
    // its readiness probe targets 8081 before handing over to the watcher.
    const start = spawnSync("enonic", ["sandbox", "start", binding, "--detach", "--http.port", "8081"], options);
    if (start.error) throw start.error;
    if (start.status !== 0) process.exit(start.status ?? 1);
  }
}
const result = spawnSync("enonic", args, options);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
