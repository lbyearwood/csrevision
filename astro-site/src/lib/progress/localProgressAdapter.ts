export type LessonProgressSnapshot = {
  lessonId: string;
  activeSectionId: string;
  completedSectionIds: string[];
};

const storageKey = "csrevision.lessonProgress";

export function readLocalLessonProgress(): LessonProgressSnapshot[] {
  if (typeof localStorage === "undefined") return [];

  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeLocalLessonProgress(progress: LessonProgressSnapshot[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(progress));
}
