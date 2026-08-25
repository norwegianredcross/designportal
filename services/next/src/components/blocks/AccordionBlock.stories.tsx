import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccordionBlock } from "@/components/blocks/AccordionBlock";

const meta: MetaData = {
  apiUrl: "http://localhost:8080/site/rodekors/master",
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
  title: "Blocks/AccordionBlock",
  component: AccordionBlock,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    meta: {
      table: { disable: true },
    },
  },
  args: {
    meta,
  },
} satisfies Meta<typeof AccordionBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockAccordion",
      title: "Hva lurer du på?",
      theme: "accent",
      items: [
        {
          title: "Hvem kan bli frivillig?",
          text: {
            processedHtml: `
              <p>I utgangspunktet kan alle over 18 år bli frivillig i Røde Kors. Du trenger ingen spesiell utdannelse
              eller bakgrunn for å bli frivillig. Det viktigste for oss er at du har tid og lyst til å bidra, og at du
              møter andre fordomsfritt, med vennlighet og respekt.</p>

              <p>Vær oppmerksom på at noen aktiviteter har høyere aldersgrense. Det gjelder Fellesverket (20 år), Kors
              på halsen (22 år), Våketjenesten, Visitortjenesten og Nettverk etter soning (25 år). I Røde Kors Ungdom
              kan alle mellom 13 og 30 år bli frivillig.</p>`,
            links: [],
            images: [],
          },
        },
        {
          title: "Hvor mye tid tar det å være frivillig?",
          text: {
            processedHtml: `
              <p>Antall timer du bruker som frivillig i Røde Kors varierer. I noen aktiviteter avtaler man tidspunktet selv
              eller setter seg opp på vakter, mens i andre aktiviteter deltar man fast i en kortere eller lengre periode.
               <a title="Lokalforeninger i Røde Kors" href="/lokalforeninger/">Din lokale Røde Kors-forening</a> gir deg
               informasjon om hva som gjelder for din aktivitet.</p>

               <p><strong>Noen eksempler:</strong> Som besøksvenn treffer man en besøksvert fast et par timer annenhver
               uke, mens frivillige i leksehjelp setter seg opp på vakter. I flyktningguide møtes man som regel et par
               timer i uken eller måneden, over en periode på 9 –12 måneder.</p>`,
            links: [],
            images: [],
          },
        },
        {
          title: "Hva skjer hvis jeg ikke kan delta hver gang eller skal på ferie?",
          text: {
            processedHtml: `
              <p>Det går helt fint. Du finner ut hva som passer med ditt tidsskjema sammen din lokalforening.
              Det går også fint å reise bort på ferie så lenge du gir beskjed i forkant.</p>`,
            links: [],
            images: [],
          },
        },
        {
          title: "Hvordan velger jeg aktivitet?",
          text: {
            processedHtml: `
                <p>Når du har registrert deg som frivillig vil din lokale Røde Kors-forening ta kontakt, og sammen
                finner dere en passende aktivitet. Valget baserer seg på dine ønsker, tiden du kan bruke, tilbudet i
                lokalforeningen og behovet for nye frivillige. Det er også mulig å engasjere seg i flere aktiviteter
                hvis du ønsker det. <a title="Aktiviteter og tilbud i Røde Kors" href="/tilbudene/">Les mer om våre
                tilbud og aktiviteter</a>.</p>

                <p>Hvis du ønsker du å bli frivillig i en aktivitet som din lokalforening ikke har, kan du undersøke
                muligheter i nærliggende lokalforeninger. Det er også mulig å bytte aktivitet senere.</p>`,
            links: [],
            images: [],
          },
        },
      ],
    },
  },
};

export const SingleItem: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockAccordion",
      title: "Hva lurer du på?",
      theme: "accent",
      items: [
        {
          title: "Hvem kan bli frivillig?",
          text: {
            processedHtml: `
              <p>I utgangspunktet kan alle over 18 år bli frivillig i Røde Kors. Du trenger ingen spesiell utdannelse
              eller bakgrunn for å bli frivillig. Det viktigste for oss er at du har tid og lyst til å bidra, og at du
              møter andre fordomsfritt, med vennlighet og respekt.</p>

              <p>Vær oppmerksom på at noen aktiviteter har høyere aldersgrense. Det gjelder Fellesverket (20 år), Kors
              på halsen (22 år), Våketjenesten, Visitortjenesten og Nettverk etter soning (25 år). I Røde Kors Ungdom
              kan alle mellom 13 og 30 år bli frivillig.</p>`,
            links: [],
            images: [],
          },
        },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockAccordion",
      title: "Tomt trekkspill",
      theme: "accent",
      items: [],
    },
  },
};
