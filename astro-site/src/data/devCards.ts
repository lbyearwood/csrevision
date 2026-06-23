export type DevCardDefinition = {
  title: string;
  slug: string;
  href?: string;
  complete?: boolean;
};

const cardHref = (slug: string) => `/dev-dashboard/cards/${slug}/`;

export const devCardDefinitions: DevCardDefinition[] = [
  {
    title: "ExplanationCard",
    slug: "explanation-card",
    href: cardHref("explanation-card"),
    complete: true,
  },
  {
    title: "DiagramCard",
    slug: "diagram-card",
    href: cardHref("diagram-card"),
    complete: true,
  },
  {
    title: "InteractiveDiagramCard",
    slug: "interactive-diagram-card",
    href: cardHref("interactive-diagram-card"),
    complete: true,
  },
  {
    title: "ImageCard",
    slug: "image-card",
    href: cardHref("image-card"),
    complete: true,
  },
  {
    title: "SupportCard",
    slug: "support-card",
    href: cardHref("support-card"),
    complete: true,
  },
  {
    title: "TableCard",
    slug: "table-card",
    href: cardHref("table-card"),
    complete: true,
  },
  {
    title: "InteractiveTableCard",
    slug: "interactive-table-card",
    href: cardHref("interactive-table-card"),
    complete: true,
  },
  {
    title: "ModellingCard",
    slug: "modelling-card",
    href: cardHref("modelling-card"),
    complete: true,
  },
  {
    title: "SingleMultipleChoiceCard",
    slug: "question-card",
    href: cardHref("question-card"),
    complete: true,
  },
  {
    title: "SeveralMultipleChoiceCard",
    slug: "several-multiple-choice-card",
    href: cardHref("several-multiple-choice-card"),
    complete: true,
  },
  {
    title: "AnswerCard",
    slug: "answer-card",
    href: cardHref("answer-card"),
    complete: true,
  },
  {
    title: "PromptCard",
    slug: "prompt-card",
    href: cardHref("prompt-card"),
    complete: true,
  },
  {
    title: "ExamQuestionCard",
    slug: "exam-practice-card",
    href: cardHref("exam-practice-card"),
    complete: true,
  },
  {
    title: "SummaryCard",
    slug: "summary-card",
    href: cardHref("summary-card"),
    complete: true,
  },
  {
    title: "LearningObjectivesCard",
    slug: "learning-objectives-card",
    href: cardHref("learning-objectives-card"),
    complete: true,
  },
  {
    title: "InstructionCard",
    slug: "instruction-card",
    href: cardHref("instruction-card"),
    complete: true,
  },
  {
    title: "FlashCard",
    slug: "matching-area-card",
    href: cardHref("matching-area-card"),
    complete: true,
  },
  {
    title: "VisualFlashCard",
    slug: "visual-flashcard",
    href: cardHref("visual-flashcard"),
    complete: true,
  },
  {
    title: "LogicGateCard",
    slug: "logic-gate-card",
    href: cardHref("logic-gate-card"),
    complete: true,
  },
  {
    title: "CodingCard",
    slug: "coding-card",
    href: cardHref("coding-card"),
    complete: true,
  },
  {
    title: "MarkSchemeCard",
    slug: "mark-scheme-card",
    href: cardHref("mark-scheme-card"),
    complete: true,
  },
  {
    title: "MisconceptionCard",
    slug: "misconception-card",
    href: cardHref("misconception-card"),
    complete: true,
  },
  {
    title: "HingeQuestionCard",
    slug: "hinge-question-card",
    href: cardHref("hinge-question-card"),
    complete: true,
  },
  {
    title: "ProcessSequenceCard",
    slug: "process-sequence-card",
    href: cardHref("process-sequence-card"),
    complete: true,
  },
  {
    title: "VocabularyCard",
    slug: "vocabulary-card",
    href: cardHref("vocabulary-card"),
    complete: true,
  },
];
