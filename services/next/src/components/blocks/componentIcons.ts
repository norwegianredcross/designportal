/**
 * Pictogram per component, files under public/components/. They are UI
 * chrome of the catalogue, not editorial images, which is why they ship
 * with the app rather than as Enonic media: they only make sense next to
 * the component name the library exports. The set is generated in one
 * visual language by the migration repo's scripts/pictograms.mjs (flat,
 * rounded, three theme colours); a new component gets a glyph there and the
 * file lands here. A component without a file gets a neutral placeholder.
 */
export const componentIcons: Record<string, string> = Object.fromEntries(
  [
    "Alert",
    "Avatar",
    "Badge",
    "Breadcrumbs",
    "Button",
    "Card",
    "Carousel",
    "Checkbox",
    "Chip",
    "DateInput",
    "DatePicker",
    "Details",
    "Dialog",
    "Divider",
    "Donor",
    "Dropdown",
    "ErrorSummary",
    "Field",
    "Fieldset",
    "Footer",
    "GraphicElement",
    "Header",
    "Heading",
    "Input",
    "Label",
    "Link",
    "List",
    "Pagination",
    "Paragraph",
    "Popover",
    "Radio",
    "Search",
    "Select",
    "SkeletonLoader",
    "SkipLink",
    "Spinner",
    "Suggestion",
    "Switch",
    "Table",
    "Tabs",
    "Tag",
    "Textarea",
    "Textfield",
    "ToggleGroup",
    "Tooltip",
    "ValidationMessage",
  ].map((name) => [name, `${name.toLowerCase()}.svg`]),
);
