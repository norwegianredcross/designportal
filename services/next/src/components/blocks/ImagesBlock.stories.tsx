import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ImagesBlock } from "@/components/blocks/ImagesBlock";

const meta: MetaData = {
  apiUrl: "http://localhost:8080/site/designsystem-docs/master",
  baseUrl: "/",
  canRender: true,
  catchAll: false,
  defaultLocale: "no",
  locale: "no",
  id: "130dd4c1-5e99-4164-800e-356b027754f8",
  path: "om-oss",
  renderMode: RENDER_MODE.NEXT,
  requestType: XP_REQUEST_TYPE.PAGE,
  type: "no.rodekors.docs:page",
};

const storyMeta = {
  title: "Blocks/ImagesBlock",
  component: ImagesBlock,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    meta: {
      table: { disable: true },
    },
    // Code-level defaults (the CMS fields override them in production):
    // single-image width/alignment and the Design retning silhouettes.
    size: {
      control: "select",
      options: ["full", "medium", "small"],
    },
    alignment: {
      control: "select",
      options: ["left", "right"],
    },
    shape: {
      control: "select",
      options: ["rounded", "notch"],
    },
    // Bite geometry for the notched shapes: width/depth in percent of the
    // image box, plus the box's aspect ratio.
    notch: {
      control: "object",
    },
  },
  args: {
    meta,
    size: "medium",
    shape: "rounded",
  },
} satisfies Meta<typeof ImagesBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      // The CMS fields are null in stories so the component props (the
      // Storybook controls) drive size, alignment and shape.
      size: null,
      alignment: null,
      form: null,
      notchCorner: null,
      notchWidth: null,
      notchDepth: null,
      items: [
        {
          image: {
            _id: "story-image-1",
            imageUrl: "https://placehold.co/600x800/D52B1E/fff?text=Bilde",
            imageUrl2x: "https://placehold.co/1200x1600/D52B1E/fff?text=Bilde",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "600", imageHeight: "800" } } },
          },
          altText: "Frivillige fra Røde Kors deler ut mat",
          caption: "Frivillige i aksjon under vinterberedskapen.",
        },
      ],
    },
  },
};

/** Several entries render as the two-column bildegalleri grid; captions are optional. */
export const Gallery: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      // The CMS fields are null in stories so the component props (the
      // Storybook controls) drive size, alignment and shape.
      size: null,
      alignment: null,
      form: null,
      notchCorner: null,
      notchWidth: null,
      notchDepth: null,
      items: [
        {
          image: {
            _id: "story-image-2",
            imageUrl: "https://placehold.co/768x432/D52B1E/fff?text=1",
            imageUrl2x: "https://placehold.co/1536x864/D52B1E/fff?text=1",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "768", imageHeight: "432" } } },
          },
          altText: "Første bilde",
          caption: "Med bildetekst.",
        },
        {
          image: {
            _id: "story-image-3",
            imageUrl: "https://placehold.co/768x432/1E1E1E/fff?text=2",
            imageUrl2x: "https://placehold.co/1536x864/1E1E1E/fff?text=2",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "768", imageHeight: "432" } } },
          },
          altText: "Andre bilde",
          caption: null,
        },
        {
          // Odd count: the third tile wraps to its own row at column width
          // (auto-fill keeps the empty track) instead of stretching. Its
          // portrait source also pins the uniform 2:1 crop.
          image: {
            _id: "story-image-4",
            imageUrl: "https://placehold.co/600x800/78909C/fff?text=3",
            imageUrl2x: "https://placehold.co/1200x1600/78909C/fff?text=3",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "600", imageHeight: "800" } } },
          },
          altText: "Tredje bilde",
          caption: "Oddetall wrapper pent.",
        },
      ],
    },
  },
};

/** The Design retning notched step form: a bite clipped from one edge by
 * the generated SVG mask (notchMask.ts). */
export const Notch: Story = {
  args: {
    size: "medium",
    shape: "notch",
    notch: { edge: "bottom", offset: 100 },
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      // The CMS fields are null in stories so the component props (the
      // Storybook controls) drive size, alignment and shape.
      size: null,
      alignment: null,
      form: null,
      notchCorner: null,
      notchWidth: null,
      notchDepth: null,
      items: [
        {
          image: {
            _id: "story-image-5",
            imageUrl: "https://placehold.co/800x600/2E7D32/fff?text=Bilde",
            imageUrl2x: "https://placehold.co/1600x1200/2E7D32/fff?text=Bilde",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "800", imageHeight: "600" } } },
          },
          altText: "Telt i skogen",
          caption: null,
        },
      ],
    },
  },
  /* The regression this guards: the notch used to fall back to 4 / 3 for every
     image, so picking the shape recropped the picture. This story sets no
     aspect prop, so the 800x600 source must drive both the box and the mask. */
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByAltText("Telt i skogen");
    await expect(img.style.getPropertyValue("--rk-notch-aspect")).toBe("800 / 600");
    await expect(getComputedStyle(img).aspectRatio).toBe("800 / 600");
    // The mask's viewBox is generated from the same ratio: 1000 x (1000*600/800).
    await expect(img.style.getPropertyValue("--rk-notch-mask")).toContain("0%200%201000%20750");
  },
};

/** Same silhouette, different geometry: a wide shallow bite on a broad
 * hero — showing how the notch prop composes new variants. */
export const NotchWide: Story = {
  play: async ({ canvasElement }) => {
    // The other half of the rule: an aspect the code states outright still
    // beats the image's own shape, so a deliberate hero crop stays possible.
    const img = within(canvasElement).getByAltText("Bredt heltebilde");
    await expect(img.style.getPropertyValue("--rk-notch-aspect")).toBe("21 / 9");
  },
  args: {
    size: "full",
    shape: "notch",
    notch: { edge: "bottom", offset: 0, width: 55, depth: 18, aspect: "21 / 9" },
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      // The CMS fields are null in stories so the component props (the
      // Storybook controls) drive size, alignment and shape.
      size: null,
      alignment: null,
      form: null,
      notchCorner: null,
      notchWidth: null,
      notchDepth: null,
      items: [
        {
          image: {
            _id: "story-image-6",
            imageUrl: "https://placehold.co/1600x686/D52B1E/fff?text=Bred",
            imageUrl2x: "https://placehold.co/3200x1372/D52B1E/fff?text=Bred",
            // Source pixel size, as strings — that is how XP stores media:imageInfo.
            x: { media: { imageInfo: { imageWidth: "1600", imageHeight: "686" } } },
          },
          altText: "Bredt heltebilde",
          caption: null,
        },
      ],
    },
  },
};
