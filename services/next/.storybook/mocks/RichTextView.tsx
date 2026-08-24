import type { RichTextData } from "@enonic/nextjs-adapter/types/component";

interface Props {
  data: RichTextData;
}

export default function RichTextView({ data }: Props) {
  return (
    <div
      data-storybook-mock="RichTextView"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This is only used for mocking
      dangerouslySetInnerHTML={{ __html: data?.processedHtml ?? "" }}
    />
  );
}
