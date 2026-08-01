import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestsPage } from './TeacherApp';

const appState = vi.hoisted(() => ({
  subjects: [
    { id: 'ocr', subjectName: 'OCR GCSE Computer Science', description: 'OCR course' },
    { id: 'btec', subjectName: 'BTEC Digital IT', description: 'BTEC course' },
  ],
  units: [
    { id: 'hardware', subjectId: 'ocr', unitName: '4. Hardware' },
    { id: 'btec-unit', subjectId: 'btec', unitName: '1. Exploring User Interface Design' },
  ],
  topics: [
    {
      id: 'logic-gates',
      unitId: 'hardware',
      topicName: '4.3 Logic gates and truth tables',
      revisionObjectives: ['Complete truth tables for AND, OR and NOT gates.'],
      revisionSupplementKeys: ['logic_gates_reference'],
    },
    {
      id: 'btec-topic',
      unitId: 'btec-unit',
      topicName: '1.1 User interfaces',
      revisionObjectives: [],
      revisionSupplementKeys: [],
    },
  ],
  tests: [
    { id: 'published', topicId: 'logic-gates', testTitle: 'Published gates test', testDescription: 'Published resource', defaultMode: 'practice', defaultTimeLimitSeconds: 600, markingMethod: 'auto_marked', randomiseQuestions: false, shuffleOptions: false, status: 'published' },
    { id: 'draft', topicId: 'logic-gates', testTitle: 'Draft gates test', testDescription: 'Draft resource', defaultMode: 'practice', defaultTimeLimitSeconds: 900, markingMethod: 'teacher_marked', randomiseQuestions: false, shuffleOptions: false, status: 'draft' },
    { id: 'archived', topicId: 'logic-gates', testTitle: 'Archived gates test', testDescription: 'Archived resource', defaultMode: 'practice', defaultTimeLimitSeconds: 1200, markingMethod: 'self_marked', randomiseQuestions: false, shuffleOptions: false, status: 'archived' },
    { id: 'btec-test', topicId: 'btec-topic', testTitle: 'BTEC interface test', testDescription: 'BTEC resource', defaultMode: 'practice', defaultTimeLimitSeconds: 600, markingMethod: 'auto_marked', randomiseQuestions: false, shuffleOptions: false, status: 'published' },
  ],
  testVersions: [
    { id: 'published-version', testId: 'published', versionNumber: 2, totalMarks: 2, status: 'published' },
    { id: 'archived-version', testId: 'archived', versionNumber: 1, totalMarks: 1, status: 'archived' },
    { id: 'btec-version', testId: 'btec-test', versionNumber: 1, totalMarks: 1, status: 'published' },
  ],
  questions: [
    { id: 'q1', testVersionId: 'published-version', questionOrder: 1, questionType: 'short_answer', questionText: 'First preview question?', maxMarks: 1 },
    { id: 'q2', testVersionId: 'published-version', questionOrder: 2, questionType: 'short_answer', questionText: 'Second preview question?', maxMarks: 1 },
    { id: 'archived-q', testVersionId: 'archived-version', questionOrder: 1, questionType: 'short_answer', questionText: 'Archived preview question?', maxMarks: 1 },
    { id: 'btec-q', testVersionId: 'btec-version', questionOrder: 1, questionType: 'short_answer', questionText: 'BTEC preview question?', maxMarks: 1 },
  ],
}));

vi.mock('../../app/AppState', () => ({ useAppState: () => appState }));

function selectTopic(courseName = 'OCR GCSE Computer Science', unitName = '4. Hardware', topicName = '4.3 Logic gates and truth tables') {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(courseName) }));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(unitName) }));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(topicName) }));
}

describe('Teacher Courses', () => {
  beforeEach(() => render(<TestsPage />));

  it('navigates course to unit to topic, keeps tests outside objectives, and resets the disclosure', () => {
    expect(screen.getByRole('heading', { name: 'Courses' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /OCR GCSE Computer Science/ }));
    expect(screen.getByRole('heading', { name: 'Units in OCR GCSE Computer Science' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /4\. Hardware/ }));
    expect(screen.getByRole('heading', { name: 'Choose a topic in 4. Hardware' })).toBeInTheDocument();
    expect(screen.queryByText('Published gates test')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /4\.3 Logic gates and truth tables/ }));

    const disclosure = screen.getByText('For this topic, you must be able to…').closest('details');
    expect(disclosure).not.toHaveAttribute('open');
    expect(screen.getByText('Published gates test')).toBeVisible();
    fireEvent.click(within(disclosure!).getByText('For this topic, you must be able to…'));
    expect(disclosure).toHaveAttribute('open');
    expect(screen.getByRole('table', { name: 'AND and OR truth table' })).toBeInTheDocument();
    expect(screen.getByText('Published gates test')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '4. Hardware' }));
    fireEvent.click(screen.getByRole('button', { name: /4\.3 Logic gates and truth tables/ }));
    expect(screen.getByText('For this topic, you must be able to…').closest('details')).not.toHaveAttribute('open');
  });

  it('retains all statuses and uses the existing read-only question preview', () => {
    selectTopic();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.getByText('Version 2')).toBeInTheDocument();
    expect(screen.getByText('2 questions')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('Auto-marked')).toBeInTheDocument();

    const previewButtons = screen.getAllByRole('button', { name: 'Preview' });
    expect(previewButtons[0]).toBeEnabled();
    expect(previewButtons[1]).toBeDisabled();
    expect(previewButtons[2]).toBeEnabled();
    fireEvent.click(previewButtons[0]);
    expect(screen.getByRole('dialog', { name: 'Published gates test preview' })).toBeInTheDocument();
    expect(screen.getByText('Read-only test content. Nothing is recorded.')).toBeInTheDocument();
    expect(screen.getByText('First preview question?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Second preview question?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByText('First preview question?')).toBeInTheDocument();
  });

  it('keeps a topic without objectives as a test-only page', () => {
    selectTopic('BTEC Digital IT', '1. Exploring User Interface Design', '1.1 User interfaces');
    expect(screen.queryByText('For this topic, you must be able to…')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tests for 1.1 User interfaces' })).toBeInTheDocument();
    expect(screen.getByText('BTEC interface test')).toBeVisible();
  });
});
