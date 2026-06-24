import type { LessonSlideShellLabel } from "./lessonSlideShellLabels";

export type CardVariant =
  | "teaching"
  | "modelling"
  | "assessment"
  | "support"
  | "exam"
  | "task";

export type LessonNavSection = {
  id: string;
  title: string;
};

export type LessonDiagramItem = {
  label: string;
  detail: string;
  tone?: "blue" | "green" | "red" | "amber";
};

export type LessonTable = {
  headers: string[];
  rows: string[][];
};

export type LessonCardData = {
  title: string;
  kind?: "explain" | "list" | "steps" | "table" | "process" | "callout" | "question" | "grid";
  body?: string;
  items?: string[];
  table?: LessonTable;
  process?: LessonDiagramItem[];
  prompt?: string;
  answer?: string;
  tone?: "blue" | "green" | "red" | "amber";
};

export type LessonSectionData = {
  id: string;
  label: LessonSlideShellLabel;
  heading: string;
  cards: LessonCardData[];
  support: {
    title: string;
    prompt: string;
    detail: string;
  };
};

export type LessonPageData = {
  courseTitle: string;
  breadcrumb: string[];
  backHref: string;
  backLabel: string;
  lessonTitle: string;
  sections: LessonSectionData[];
};
