export type DevCardDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const cardHref = (slug: string) => `/dev-dashboard/cards/${slug}/`;

export const devCardDefinitions: DevCardDefinition[] = [
  {
    title: "Explanation card",
    slug: "explanation-card",
    href: cardHref("explanation-card"),
    complete: true,
  },
  {
    title: "Diagram card",
    slug: "diagram-card",
    href: cardHref("diagram-card"),
    complete: true,
  },
  {
    title: "Interactive diagram card",
    slug: "interactive-diagram-card",
    href: cardHref("interactive-diagram-card"),
    complete: true,
  },
  {
    title: "Image card",
    slug: "image-card",
    href: cardHref("image-card"),
    complete: true,
  },
  {
    title: "Support card",
    slug: "support-card",
    href: cardHref("support-card"),
    complete: true,
  },
  {
    title: "Table card",
    slug: "table-card",
    href: cardHref("table-card"),
    complete: true,
  },
  {
    title: "Interactive table card",
    slug: "interactive-table-card",
    href: cardHref("interactive-table-card"),
    complete: true,
  },
  {
    title: "Modelling card",
    slug: "modelling-card",
    href: cardHref("modelling-card"),
    complete: true,
  },
  {
    title: "Single multiple choice card",
    slug: "question-card",
    href: cardHref("question-card"),
    complete: true,
  },
  {
    title: "Several multiple choice card",
    slug: "several-multiple-choice-card",
    href: cardHref("several-multiple-choice-card"),
    complete: true,
  },
  {
    title: "Answer card",
    slug: "answer-card",
    href: cardHref("answer-card"),
    complete: true,
  },
  {
    title: "Prompt card",
    slug: "prompt-card",
    href: cardHref("prompt-card"),
    complete: true,
  },
  {
    title: "Exam question card",
    slug: "exam-practice-card",
    href: cardHref("exam-practice-card"),
    complete: true,
  },
  {
    title: "Summary card",
    slug: "summary-card",
    href: cardHref("summary-card"),
    complete: true,
  },
  {
    title: "Instruction card",
    slug: "instruction-card",
    href: cardHref("instruction-card"),
    complete: true,
  },
  {
    title: "Flash card",
    slug: "matching-area-card",
    href: cardHref("matching-area-card"),
  },
  {
    title: "Mark scheme card",
    slug: "mark-scheme-card",
    href: cardHref("mark-scheme-card"),
    complete: true,
  },
  {
    title: "Misconception card",
    slug: "misconception-card",
    href: cardHref("misconception-card"),
    complete: true,
  },
];
