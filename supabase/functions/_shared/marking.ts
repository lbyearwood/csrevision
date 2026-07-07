export interface ServerQuestion {
  id: string;
  question_type: string;
  max_marks: number;
  correct_answer: unknown;
  accepted_keywords: string[] | null;
}

export interface MarkedResult {
  isCorrect: boolean;
  marks: number;
  feedback: string;
}

function normaliseText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function markQuestion(question: ServerQuestion, answerValue: unknown): MarkedResult {
  const rawAnswer = Array.isArray(answerValue) ? String(answerValue[0] ?? '') : String(answerValue ?? '');

  if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
    const expected = Array.isArray(question.correct_answer)
      ? String(question.correct_answer[0] ?? '')
      : String(question.correct_answer ?? '');
    const isCorrect = rawAnswer === expected;
    return {
      isCorrect,
      marks: isCorrect ? Number(question.max_marks) : 0,
      feedback: isCorrect ? 'Correct answer.' : 'Review this question and try again.',
    };
  }

  const accepted = [
    ...(Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer]),
    ...(question.accepted_keywords ?? []),
  ]
    .filter(Boolean)
    .map((value) => normaliseText(String(value)));
  const received = normaliseText(rawAnswer);
  const isCorrect = accepted.some((value) => received === value || received.includes(value));
  return {
    isCorrect,
    marks: isCorrect ? Number(question.max_marks) : 0,
    feedback: isCorrect ? 'Accepted answer.' : 'Check the key wording for this topic.',
  };
}
