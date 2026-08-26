import fs from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Driftvakt for prose-stilene: .rk-prose a i globals.css speiler Digdirs
 * .ds-link, og dette er testen som håndhever det. En Digdir-bump som
 * endrer lenkedeklarasjonene blir rød her i stedet for at prose driver
 * stille fra komponentens utseende.
 */
const digdirCss = fs.readFileSync("node_modules/@digdir/designsystemet-css/dist/src/link.css", "utf8");
const proseCss = fs.readFileSync("src/app/globals.css", "utf8");

/** Trekker ut --dsc-*-deklarasjonene fra første blokk som matcher selektoren. */
function customProps(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  expect(start, `fant ikke ${selector}`).toBeGreaterThanOrEqual(0);
  const block = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const props: Record<string, string> = {};
  for (const m of block.matchAll(/(--dsc-[\w-]+)\s*:\s*([^;]+)/g)) {
    props[m[1]] = m[2].trim();
  }
  return props;
}

describe("globals.css", () => {
  it("er syntaktisk balansert (en manglende klamme sluker alle regler etter seg)", () => {
    // Regresjonsvakt: en tapt } i en merge gjorde at parseren slukte hele
    // prose-seksjonen som ugyldige deklarasjoner — lenkene falt stille
    // tilbake til nettleserens standardblå.
    expect(proseCss.split("{").length).toBe(proseCss.split("}").length);
  });
});

describe("rk-prose", () => {
  it("speiler Digdirs .ds-link-variabler eksakt", () => {
    const digdir = customProps(digdirCss, ".ds-link");
    const prose = customProps(proseCss, ".rk-prose a");
    // Prose trenger ikke alle Digdirs variabler, men alt prose DEFINERER
    // må matche Digdir.
    for (const [prop, value] of Object.entries(prose)) {
      expect(digdir[prop], `${prop} finnes ikke lenger i Digdirs .ds-link`).toBeDefined();
      expect(value, `${prop} har driftet fra Digdirs verdi`).toBe(digdir[prop]);
    }
    expect(Object.keys(prose).length).toBeGreaterThanOrEqual(6);
  });
});
