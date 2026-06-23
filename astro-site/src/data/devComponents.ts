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
    complete: true,
  },
  {
    title: "Previous button",
    slug: "previous-button",
    href: componentHref("previous-button"),
    complete: true,
  },
  {
    title: "Next button",
    slug: "next-button",
    href: componentHref("next-button"),
    complete: true,
  },
  {
    title: "Reset button",
    slug: "reset-button",
    href: componentHref("reset-button"),
    complete: true,
  },
  {
    title: "Multiple-choice option",
    slug: "multiple-choice-option",
    href: componentHref("multiple-choice-option"),
    complete: true,
  },
  {
    title: "Correct marker",
    slug: "correct-marker",
    href: componentHref("correct-marker"),
    complete: true,
  },
  {
    title: "Incorrect marker",
    slug: "incorrect-marker",
    href: componentHref("incorrect-marker"),
    complete: true,
  },
  {
    title: "Feedback state",
    slug: "feedback-state",
    href: componentHref("feedback-state"),
    complete: true,
  },
  {
    title: "Hint toggle",
    slug: "hint-toggle",
    href: componentHref("hint-toggle"),
    complete: true,
  },
  {
    title: "Expand/collapse panel",
    slug: "expand-collapse-panel",
    href: componentHref("expand-collapse-panel"),
    complete: true,
  },
  {
    title: "Step connector",
    slug: "step-connector",
    href: componentHref("step-connector"),
    complete: true,
  },
  {
    title: "Flow connector",
    slug: "flow-connector",
    href: componentHref("flow-connector"),
    complete: true,
  },
  {
    title: "Label badge",
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
    title: "Diagram label",
    slug: "diagram-label",
    href: componentHref("diagram-label"),
    complete: true,
  },
  {
    title: "Image hotspot",
    slug: "image-hotspot",
    href: componentHref("image-hotspot"),
    complete: true,
  },
  {
    title: "Drag handle",
    slug: "drag-handle",
    href: componentHref("drag-handle"),
    complete: true,
  },
  {
    title: "Mark scheme bullet",
    slug: "mark-scheme-bullet",
    href: componentHref("mark-scheme-bullet"),
    complete: true,
  },
];
