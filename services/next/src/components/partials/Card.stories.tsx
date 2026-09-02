import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/components/partials/Card";

const image = {
  src: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
  srcSet: "https://placehold.co/384x216/D52B1E/fff?text=Kort 1x, https://placehold.co/768x432/D52B1E/fff?text=Kort 2x",
  alt: "",
};

const storyMeta = {
  title: "Partials/Card",
  component: Card,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    kicker: "Stikktittel",
    title: "Korttittel",
    text: "En kort beskrivelse av hva kortet leder til.",
  },
} satisfies Meta<typeof Card>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** Liten: the vertical card, image stacked on top of the panel. This is what a
 * three-column block renders. */
export const Liten: Story = {
  args: { size: "liten", placement: "top", image },
};

/** Medium: horizontal, image beside the text in the smaller 4:3 box. */
export const Medium: Story = {
  args: { size: "medium", placement: "left", image },
};

/** Stor: the full-width card — roomier 40px padding and a 16:9 image. */
export const Stor: Story = {
  args: { size: "stor", placement: "left", image },
};

/** placement mirrors each pair, so the picture follows the text instead of
 * leading it. Here the liten card's image moves below the panel. */
export const BildeUnder: Story = {
  args: { size: "liten", placement: "bottom", image },
};

/** ...and the horizontal card's image moves to the right. */
export const BildeHoyre: Story = {
  args: { size: "medium", placement: "right", image },
};

/** Without an image the card is a plain tinted panel with every corner
 * rounded — placement has nothing to place. */
export const UtenBilde: Story = {
  args: { size: "liten", image: null },
};

/** The theme id becomes a data-color scope, so the surface AND the text follow
 * the editor's choice. An unknown id matches no scope and simply inherits the
 * page palette. */
export const Tema: Story = {
  args: { size: "liten", theme: "additional-color-ocean", image: null },
};

/** Every text field is optional: a card with only a title still renders. */
export const BareTittel: Story = {
  args: { kicker: null, text: null, size: "liten", image: null },
};
