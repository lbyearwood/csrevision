export type DevComponentDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const componentHref = (slug: string) => `/dev-dashboard/components/${slug}/`;

export const devComponentDefinitions: DevComponentDefinition[] = [
  {
    title: "RevealButton",
    slug: "reveal-button",
    href: componentHref("reveal-button"),
    complete: true,
  },
  {
    title: "PreviousButton",
    slug: "previous-button",
    href: componentHref("previous-button"),
    complete: true,
  },
  {
    title: "NextButton",
    slug: "next-button",
    href: componentHref("next-button"),
    complete: true,
  },
  {
    title: "ResetButton",
    slug: "reset-button",
    href: componentHref("reset-button"),
    complete: true,
  },
  {
    title: "MultipleChoiceOption",
    slug: "multiple-choice-option",
    href: componentHref("multiple-choice-option"),
    complete: true,
  },
  {
    title: "ResultMarkerCorrect",
    slug: "correct-marker",
    href: componentHref("correct-marker"),
    complete: true,
  },
  {
    title: "ResultMarkerIncorrect",
    slug: "incorrect-marker",
    href: componentHref("incorrect-marker"),
    complete: true,
  },
  {
    title: "FeedbackState",
    slug: "feedback-state",
    href: componentHref("feedback-state"),
    complete: true,
  },
  {
    title: "HintToggle",
    slug: "hint-toggle",
    href: componentHref("hint-toggle"),
    complete: true,
  },
  {
    title: "DisclosurePanel",
    slug: "expand-collapse-panel",
    href: componentHref("expand-collapse-panel"),
    complete: true,
  },
  {
    title: "StepConnector",
    slug: "step-connector",
    href: componentHref("step-connector"),
    complete: true,
  },
  {
    title: "FlowConnector",
    slug: "flow-connector",
    href: componentHref("flow-connector"),
    complete: true,
  },
  {
    title: "LabelBadge",
    slug: "label-badge",
    href: componentHref("label-badge"),
    complete: true,
  },
  {
    title: "Tooltip",
    slug: "tooltip",
    href: componentHref("tooltip"),
    complete: true,
  },
  {
    title: "DiagramLabel",
    slug: "diagram-label",
    href: componentHref("diagram-label"),
    complete: true,
  },
  {
    title: "ImageHotspot",
    slug: "image-hotspot",
    href: componentHref("image-hotspot"),
    complete: true,
  },
  {
    title: "DragHandle",
    slug: "drag-handle",
    href: componentHref("drag-handle"),
    complete: true,
  },
  {
    title: "MarkSchemeBullet",
    slug: "mark-scheme-bullet",
    href: componentHref("mark-scheme-bullet"),
    complete: true,
  },
  {
    title: "FlipCard",
    slug: "flip-card",
    href: componentHref("flip-card"),
    complete: true,
  },
  {
    title: "CodeBlock",
    slug: "code-block",
    href: componentHref("code-block"),
    complete: true,
  },
];
