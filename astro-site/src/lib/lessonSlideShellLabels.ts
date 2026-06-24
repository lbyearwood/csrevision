export const lessonSlideShellLabels = [
  "Lesson introduction",
  "Lesson summary",
] as const;

export type LessonPartLabel = `Part ${number} - ${string}`;
export type LessonSlideShellLabel = (typeof lessonSlideShellLabels)[number] | LessonPartLabel;

export function isLessonPartLabel(label: string): label is LessonPartLabel {
  return /^Part \d+ - .+/.test(label);
}

export function isLessonSlideShellLabel(label: string): label is LessonSlideShellLabel {
  return lessonSlideShellLabels.includes(label as (typeof lessonSlideShellLabels)[number]) || isLessonPartLabel(label);
}

export function assertLessonSlideShellLabel(label: string): asserts label is LessonSlideShellLabel {
  if (!isLessonSlideShellLabel(label)) {
    throw new Error(
      `Invalid LessonSlideShell label "${label}". Valid labels are: Lesson introduction, Lesson summary, or Part [number] - [title].`,
    );
  }
}

function getLessonPartLabelParts(label: string) {
  const match = /^Part (\d+) - (.+)$/.exec(label);
  if (!match) {
    return null;
  }

  return {
    partNumber: match[1],
    title: match[2],
  };
}

export function assertUniqueLessonPartTitles(labels: string[]) {
  const titlesByPartNumber = new Map<string, string>();

  for (const label of labels) {
    const partLabel = getLessonPartLabelParts(label);
    if (!partLabel) {
      continue;
    }

    const existingTitle = titlesByPartNumber.get(partLabel.partNumber);
    if (existingTitle && existingTitle !== partLabel.title) {
      throw new Error(
        `Invalid lesson part labels: Part ${partLabel.partNumber} is used for both "${existingTitle}" and "${partLabel.title}". Each part number must have one title per lesson.`,
      );
    }

    titlesByPartNumber.set(partLabel.partNumber, partLabel.title);
  }
}
