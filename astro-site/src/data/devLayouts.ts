export type DevLayoutZone = {
  title: string;
  detail: string;
  span: "full" | "row" | "column" | "cell" | "title";
};

export type DevLayoutDefinition = {
  title: string;
  slug: string;
  label: string;
  brief: string;
  href: string;
  zones: DevLayoutZone[];
  reviewPoints: string[];
  dependencies: string[];
};

const layoutHref = (slug: string) => `/dev-dashboard/layouts/${slug}/`;

export const devLayoutDefinitions: DevLayoutDefinition[] = [
  {
    title: "One full-span card",
    slug: "one-full-span-card",
    label: "Layout",
    brief: "One card spans the full 2 by 2 card area when a single idea, model or task needs the whole slide body.",
    href: layoutHref("one-full-span-card"),
    zones: [
      { title: "Card 1", detail: "One card spans two rows and two columns.", span: "full" },
    ],
    reviewPoints: [
      "Use when one card should dominate the slide.",
      "Avoid stretching short text just to fill the space.",
      "The card must remain readable on mobile.",
    ],
    dependencies: ["Any full-slide card"],
  },
  {
    title: "Two vertical cards",
    slug: "two-vertical-cards",
    label: "Layout",
    brief: "Two cards sit side by side, each spanning one full column of the 2 by 2 card area.",
    href: layoutHref("two-vertical-cards"),
    zones: [
      { title: "Card 1", detail: "Left card spans both rows.", span: "column" },
      { title: "Card 2", detail: "Right card spans both rows.", span: "column" },
    ],
    reviewPoints: [
      "Use for balanced comparison or explanation plus visual.",
      "Both cards should have similar visual weight.",
      "Stack cleanly on smaller screens.",
    ],
    dependencies: ["Any two cards"],
  },
  {
    title: "Two horizontal cards",
    slug: "two-horizontal-cards",
    label: "Layout",
    brief: "Two cards stack vertically, each spanning one full row of the 2 by 2 card area.",
    href: layoutHref("two-horizontal-cards"),
    zones: [
      { title: "Card 1", detail: "Top card spans both columns.", span: "row" },
      { title: "Card 2", detail: "Bottom card spans both columns.", span: "row" },
    ],
    reviewPoints: [
      "Use when the first card sets up the second card.",
      "Keep each row concise enough to scan.",
      "The order must still make sense when stacked on mobile.",
    ],
    dependencies: ["Any two cards"],
  },
  {
    title: "Wide top card + two bottom cards",
    slug: "wide-top-card-two-bottom-cards",
    label: "Layout",
    brief: "One top card spans both columns, with two smaller cards underneath.",
    href: layoutHref("wide-top-card-two-bottom-cards"),
    zones: [
      { title: "Card 1", detail: "Top card spans both columns.", span: "row" },
      { title: "Card 2", detail: "Bottom-left card.", span: "cell" },
      { title: "Card 3", detail: "Bottom-right card.", span: "cell" },
    ],
    reviewPoints: [
      "Use when one setup card introduces two follow-up cards.",
      "The bottom cards should clearly relate to the top card.",
      "Avoid making the top card a repeated title area.",
    ],
    dependencies: ["Any three cards"],
  },
  {
    title: "Two top cards + wide bottom card",
    slug: "two-top-cards-wide-bottom-card",
    label: "Layout",
    brief: "Two smaller cards sit on the top row, with one bottom card spanning both columns.",
    href: layoutHref("two-top-cards-wide-bottom-card"),
    zones: [
      { title: "Card 1", detail: "Top-left card.", span: "cell" },
      { title: "Card 2", detail: "Top-right card.", span: "cell" },
      { title: "Card 3", detail: "Bottom card spans both columns.", span: "row" },
    ],
    reviewPoints: [
      "Use when two inputs lead to one larger synthesis or check.",
      "The bottom card should resolve, summarise or apply the top cards.",
      "Keep the top cards balanced.",
    ],
    dependencies: ["Any three cards"],
  },
  {
    title: "Tall left card + two right cards",
    slug: "tall-left-card-two-right-cards",
    label: "Layout",
    brief: "One left card spans both rows, with two smaller cards stacked on the right.",
    href: layoutHref("tall-left-card-two-right-cards"),
    zones: [
      { title: "Card 1", detail: "Left card spans both rows.", span: "column" },
      { title: "Card 2", detail: "Top-right card.", span: "cell" },
      { title: "Card 3", detail: "Bottom-right card.", span: "cell" },
    ],
    reviewPoints: [
      "Use when one main model or explanation needs two supporting cards.",
      "The right cards should support, not compete with, the left card.",
      "The left card must not become too text-heavy.",
    ],
    dependencies: ["Any three cards"],
  },
  {
    title: "Two left cards + tall right card",
    slug: "two-left-cards-tall-right-card",
    label: "Layout",
    brief: "Two smaller cards stack on the left, with one right card spanning both rows.",
    href: layoutHref("two-left-cards-tall-right-card"),
    zones: [
      { title: "Card 1", detail: "Top-left card.", span: "cell" },
      { title: "Card 2", detail: "Bottom-left card.", span: "cell" },
      { title: "Card 3", detail: "Right card spans both rows.", span: "column" },
    ],
    reviewPoints: [
      "Use when two short setup cards feed into one larger visual, model or task.",
      "The right card should be worth the extra space.",
      "Reading order should remain clear.",
    ],
    dependencies: ["Any three cards"],
  },
  {
    title: "Four equal cards",
    slug: "four-equal-cards",
    label: "Layout",
    brief: "Four cards fill the 2 by 2 card area equally.",
    href: layoutHref("four-equal-cards"),
    zones: [
      { title: "Card 1", detail: "Top-left card.", span: "cell" },
      { title: "Card 2", detail: "Top-right card.", span: "cell" },
      { title: "Card 3", detail: "Bottom-left card.", span: "cell" },
      { title: "Card 4", detail: "Bottom-right card.", span: "cell" },
    ],
    reviewPoints: [
      "Use for four genuinely parallel cards.",
      "Keep each card concise and comparable.",
      "Do not use four cards when two would teach the idea more clearly.",
    ],
    dependencies: ["Any four cards"],
  },
  {
    title: "Title segment slide",
    slug: "title-segment-slide",
    label: "Segment",
    brief: "A title-only or title-led break slide used to introduce a new lesson segment outside the 2 by 2 card system.",
    href: layoutHref("title-segment-slide"),
    zones: [
      { title: "Segment title", detail: "Large title for the next lesson section.", span: "title" },
      { title: "Optional cue", detail: "Short supporting line only when it adds useful context.", span: "title" },
    ],
    reviewPoints: [
      "Use sparingly between lesson segments.",
      "Do not duplicate the numbered slide title.",
      "Keep the slide uncluttered.",
    ],
    dependencies: ["Standard numbered lesson slide shell"],
  },
];

