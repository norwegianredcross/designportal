/**
 * The catalogue's type filter. The library's manifest lists components by
 * name only, so the grouping is the platform's editorial reading of them:
 * what a designer or developer is looking for when they arrive ("a form
 * control", "something for navigation"). A component missing here lands
 * in "Annet", visibly, rather than disappearing; add it when it ships.
 */
export const COMPONENT_GROUPS = ["Skjema", "Navigasjon", "Tilbakemelding", "Innhold", "Annet"] as const;
export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

const groupOf: Record<string, ComponentGroup> = {
  Button: "Skjema",
  Checkbox: "Skjema",
  DateInput: "Skjema",
  DatePicker: "Skjema",
  ErrorSummary: "Skjema",
  Field: "Skjema",
  Fieldset: "Skjema",
  Input: "Skjema",
  Label: "Skjema",
  Radio: "Skjema",
  Search: "Skjema",
  Select: "Skjema",
  Suggestion: "Skjema",
  Switch: "Skjema",
  Textarea: "Skjema",
  Textfield: "Skjema",
  ToggleGroup: "Skjema",
  ValidationMessage: "Skjema",
  Breadcrumbs: "Navigasjon",
  Dropdown: "Navigasjon",
  Footer: "Navigasjon",
  Header: "Navigasjon",
  Link: "Navigasjon",
  Pagination: "Navigasjon",
  SkipLink: "Navigasjon",
  Tabs: "Navigasjon",
  Alert: "Tilbakemelding",
  Badge: "Tilbakemelding",
  Dialog: "Tilbakemelding",
  Popover: "Tilbakemelding",
  SkeletonLoader: "Tilbakemelding",
  Spinner: "Tilbakemelding",
  Tag: "Tilbakemelding",
  Tooltip: "Tilbakemelding",
  Avatar: "Innhold",
  Card: "Innhold",
  Carousel: "Innhold",
  Chip: "Innhold",
  Details: "Innhold",
  Divider: "Innhold",
  Donor: "Innhold",
  GraphicElement: "Innhold",
  Heading: "Innhold",
  List: "Innhold",
  Paragraph: "Innhold",
  Table: "Innhold",
};

export const componentGroup = (name: string): ComponentGroup => groupOf[name] ?? "Annet";
