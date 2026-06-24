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
  complete?: boolean;
  zones: DevLayoutZone[];
  reviewPoints: string[];
  dependencies: string[];
};

const layoutHref = (slug: string) => `/dev-dashboard/layouts/${slug}/`;

export const devLayoutDefinitions: DevLayoutDefinition[] = [
  {
    title: "OneFullSpanCard",
    slug: "one-full-span-card",
    label: "Layout",
    brief: "One card spans the full 2 by 2 card area when a single idea, model or task needs the whole slide body.",
    href: layoutHref("one-full-span-card"),
    complete: true,
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
    title: "TwoVerticalCards",
    slug: "two-vertical-cards",
    label: "Layout",
    brief: "Two cards sit side by side, each spanning one full column of the 2 by 2 card area.",
    href: layoutHref("two-vertical-cards"),
    complete: true,
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
    title: "TwoHorizontalCards",
    slug: "two-horizontal-cards",
    label: "Layout",
    brief: "Two cards stack vertically, each spanning one full row of the 2 by 2 card area.",
    href: layoutHref("two-horizontal-cards"),
    complete: true,
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
    title: "WideTopCardTwoBottomCards",
    slug: "wide-top-card-two-bottom-cards",
    label: "Layout",
    brief: "One top card spans both columns, with two smaller cards underneath.",
    href: layoutHref("wide-top-card-two-bottom-cards"),
    complete: true,
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
    title: "TwoTopCardsWideBottomCard",
    slug: "two-top-cards-wide-bottom-card",
    label: "Layout",
    brief: "Two smaller cards sit on the top row, with one bottom card spanning both columns.",
    href: layoutHref("two-top-cards-wide-bottom-card"),
    complete: true,
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
    title: "TallLeftCardTwoRightCards",
    slug: "tall-left-card-two-right-cards",
    label: "Layout",
    brief: "One left card spans both rows, with two smaller cards stacked on the right.",
    href: layoutHref("tall-left-card-two-right-cards"),
    complete: true,
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
    title: "TwoLeftCardsTallRightCard",
    slug: "two-left-cards-tall-right-card",
    label: "Layout",
    brief: "Two smaller cards stack on the left, with one right card spanning both rows.",
    href: layoutHref("two-left-cards-tall-right-card"),
    complete: true,
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
    title: "FourEqualCards",
    slug: "four-equal-cards",
    label: "Layout",
    brief: "A specialist 2 by 2 quadrant, matrix or four-way comparison layout where equal visual weight is the point. Not a common fallback for ordinary groups of four cards.",
    href: layoutHref("four-equal-cards"),
    complete: true,
    zones: [
      { title: "Card 1", detail: "Top-left card.", span: "cell" },
      { title: "Card 2", detail: "Top-right card.", span: "cell" },
      { title: "Card 3", detail: "Bottom-left card.", span: "cell" },
      { title: "Card 4", detail: "Bottom-right card.", span: "cell" },
    ],
    reviewPoints: [
      "Use only for true quadrant, matrix or four-way comparison purposes.",
      "Keep each card concise and comparable.",
      "Do not use it just because there are four cards.",
      "Prefer other accepted layouts for ordinary overviews and segue slides.",
    ],
    dependencies: ["Any four cards"],
  },
  {
    title: "TitleSegmentSlide",
    slug: "title-segment-slide",
    label: "Segment",
    brief: "A title-only slide used for the opening lesson title or as a divider between lesson parts. Part dividers must contain the full part number and title, such as Part 1 - Clock speed.",
    href: layoutHref("title-segment-slide"),
    complete: true,
    zones: [
      { title: "Lesson or part title", detail: "The lesson title on the opening slide, or the full part label between parts.", span: "title" },
    ],
    reviewPoints: [
      "Use for the opening lesson title slide or between lesson parts.",
      "When used between parts, the visible title must be the full Part [number] - [title] label.",
      "Do not use it for normal teaching content, objectives, summary or decorative breaks.",
      "Keep the slide uncluttered.",
    ],
    dependencies: ["LessonSlideShell"],
  },
];
