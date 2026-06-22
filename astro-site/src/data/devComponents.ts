export type DevComponentDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const componentHref = (slug: string) => `/dev-dashboard/components/${slug}/`;

export const devComponentDefinitions: DevComponentDefinition[] = [
  {
    title: "Reveal button",
    slug: "reveal-button",
    href: componentHref("reveal-button"),
  },
  {
    title: "Reset button",
    slug: "reset-button",
    href: componentHref("reset-button"),
  },
  {
    title: "Multiple-choice option",
    slug: "multiple-choice-option",
    href: componentHref("multiple-choice-option"),
  },
  {
    title: "Correct marker",
    slug: "correct-marker",
    href: componentHref("correct-marker"),
  },
  {
    title: "Incorrect marker",
    slug: "incorrect-marker",
    href: componentHref("incorrect-marker"),
  },
  {
    title: "Feedback state",
    slug: "feedback-state",
    href: componentHref("feedback-state"),
  },
  {
    title: "Hint toggle",
    slug: "hint-toggle",
    href: componentHref("hint-toggle"),
  },
  {
    title: "Expand/collapse panel",
    slug: "expand-collapse-panel",
    href: componentHref("expand-collapse-panel"),
  },
  {
    title: "Step connector",
    slug: "step-connector",
    href: componentHref("step-connector"),
  },
  {
    title: "Flow connector",
    slug: "flow-connector",
    href: componentHref("flow-connector"),
  },
  {
    title: "Label badge",
    slug: "label-badge",
    href: componentHref("label-badge"),
  },
  {
    title: "Tooltip",
    slug: "tooltip",
    href: componentHref("tooltip"),
  },
  {
    title: "Diagram label",
    slug: "diagram-label",
    href: componentHref("diagram-label"),
  },
  {
    title: "Image hotspot",
    slug: "image-hotspot",
    href: componentHref("image-hotspot"),
  },
  {
    title: "Drag handle",
    slug: "drag-handle",
    href: componentHref("drag-handle"),
  },
  {
    title: "Mark scheme bullet",
    slug: "mark-scheme-bullet",
    href: componentHref("mark-scheme-bullet"),
  },
];
