import { describe, expect, it } from 'vitest';
import { markQuestion, type ServerQuestion } from '../supabase/functions/_shared/marking';

const questions: ServerQuestion[] = [
  {
    id: 'q1',
    question_type: 'multiple_choice',
    max_marks: 1,
    correct_answer: 'control-unit',
    accepted_keywords: null,
  },
  {
    id: 'q2',
    question_type: 'short_fixed',
    max_marks: 1,
    correct_answer: 'fetch decode execute',
    accepted_keywords: ['fetch-decode-execute', 'fde'],
  },
];

describe('server-side marking helpers', () => {
  it('marks multiple choice by stable option id', () => {
    expect(markQuestion(questions[0], 'control-unit').marks).toBe(1);
    expect(markQuestion(questions[0], 'ram').marks).toBe(0);
  });

  it('normalises short fixed answers', () => {
    expect(markQuestion(questions[1], 'Fetch-Decode-Execute').marks).toBe(1);
  });
});
