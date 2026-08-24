import { processHtml } from "/lib/xp/portal";
import { UUID } from "/lib/rodekors/uuid";

export interface RichTextLink {
  linkRef: string;
  uri: string;
  contentId?: string;
}

export interface RichTextImage {
  imageRef: string;
  imageId: string;
  style: null;
}

interface RichTextMacroConfig {
  body?: string;
  [param: string]: string | undefined;
}

export interface RichTextMacro {
  ref: string;
  name: string;
  descriptor: string;
  config: { [macroName: string]: RichTextMacroConfig };
}

export interface RichTextShape {
  raw: string;
  processedHtml: string;
  links: RichTextLink[];
  images: RichTextImage[];
  macros: RichTextMacro[];
  macrosAsJson: RichTextMacro[];
}

export interface ProcessHtmlArgs {
  processHtml?: {
    type?: string;
    imageWidths?: number[];
    imageSizes?: string;
  };
}

const SYSTEM_MACROS: { [name: string]: string } = {
  embed: "system:embed",
  disable: "system:disable",
};

export function buildRichText(raw: string | undefined, args: ProcessHtmlArgs): RichTextShape | null {
  if (!raw) return null;
  const opts = args.processHtml ?? {};

  const links: RichTextLink[] = [];
  const images: RichTextImage[] = [];

  let injected = raw.replace(
    /<a([^>]*)\bhref="((?:content|media):\/\/(?:download\/|inline\/)?([0-9a-f-]+)[^"]*)"/g,
    (_match, attrs: string, uri: string, id: string) => {
      const ref = UUID.randomUUID().toString();
      links.push({ linkRef: ref, uri, contentId: id });
      return `<a data-link-ref="${ref}"${attrs}href="${uri}"`;
    },
  );

  injected = injected.replace(
    /<img([^>]*)\bsrc="(image:\/\/([0-9a-f-]+)[^"]*)"/g,
    (_match, attrs: string, src: string, id: string) => {
      const ref = UUID.randomUUID().toString();
      images.push({ imageRef: ref, imageId: id, style: null });
      return `<img data-image-ref="${ref}"${attrs}src="${src}"`;
    },
  );

  let processedHtml = processHtml({
    value: injected,
    type: opts.type as "server" | "absolute" | undefined,
    imageWidths: opts.imageWidths,
    imageSizes: opts.imageSizes,
  });

  const macros: RichTextMacro[] = [];
  processedHtml = processedHtml.replace(/<!--#MACRO\s+((?:_[\w-]+="[^"]*"\s*)+)-->/g, (_match, attrsBlob: string) => {
    const attrs: { [k: string]: string } = {};
    const attrRe = /_([\w-]+)="([^"]*)"/g;
    let am = attrRe.exec(attrsBlob);
    while (am !== null) {
      attrs[am[1]] = am[2];
      am = attrRe.exec(attrsBlob);
    }
    const name = attrs.name ?? "";
    const body = attrs.body ?? "";
    const ref = UUID.randomUUID().toString();
    const config: RichTextMacroConfig = { body };
    for (const k in attrs) {
      if (k !== "name" && k !== "document" && k !== "body") {
        config[k] = attrs[k];
      }
    }
    macros.push({
      ref,
      name,
      descriptor: SYSTEM_MACROS[name] ?? name,
      config: { [name]: config },
    });
    return `<editor-macro data-macro-name="${name}" data-macro-ref="${ref}">${body}</editor-macro>`;
  });

  return { raw, processedHtml, links, images, macros, macrosAsJson: macros };
}
