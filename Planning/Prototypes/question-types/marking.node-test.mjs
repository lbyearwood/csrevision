import assert from 'node:assert/strict';
import test from 'node:test';
import { markCategorisation, markExtendedResponse, markFillBlanks, markMatching, markMultipleSelect, markNumeric, markOrdering, markShortText, markSingleChoice, markSqlQuery, markStructuredFields, normaliseSql, normaliseText } from './marking.mjs';

test('single choice requires an exact configured value', () => {
  const config = { correctAnswer: 'cpu', maxMarks: 1, successFeedback: 'Correct', incorrectFeedback: 'Incorrect' };
  assert.equal(markSingleChoice('cpu', config).status, 'correct');
  assert.equal(markSingleChoice('ram', config).marks, 0);
  assert.equal(markSingleChoice('', config).status, 'unanswered');
});

test('multiple select supports exact and partial marking without rewarding guessing', () => {
  const config = { correctAnswers: ['ssd', 'hdd'], maxMarks: 2, partialMarks: true, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.deepEqual(markMultipleSelect(['ssd', 'hdd'], config), { status: 'correct', marks: 2, maxMarks: 2, feedback: 'Correct' });
  assert.equal(markMultipleSelect(['ssd'], config).marks, 1);
  assert.equal(markMultipleSelect(['ssd', 'ram'], config).marks, 0);
});

test('short text uses accepted whole-answer variants rather than substring matching', () => {
  const config = { acceptedAnswers: ['central processing unit'], caseSensitive: false, maxMarks: 1, successFeedback: 'Correct', incorrectFeedback: 'Incorrect' };
  assert.equal(markShortText('  Central   Processing Unit ', config).status, 'correct');
  assert.equal(markShortText('The central processing unit is the answer', config).status, 'incorrect');
  assert.equal(normaliseText(' CPU  '), 'cpu');
});

test('numeric marking applies tolerance and required units', () => {
  const config = { expectedValue: 4.3, tolerance: 0.01, requiredUnit: 'GB', maxMarks: 2, successFeedback: 'Correct', incorrectFeedback: 'Incorrect' };
  assert.equal(markNumeric({ value: '4.3', unit: 'GB' }, config).status, 'correct');
  assert.equal(markNumeric({ value: '4.305', unit: 'gb' }, config).status, 'correct');
  assert.equal(markNumeric({ value: '4.3', unit: 'MB' }, config).marks, 0);
  assert.equal(markNumeric({ value: '4.4', unit: 'GB' }, config).marks, 0);
});

test('matching awards proportional marks per correct pair', () => {
  const config = { correctPairs: { cpu: 'processes', ram: 'temporary' }, maxMarks: 2, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markMatching({ cpu: 'processes', ram: 'temporary' }, config).marks, 2);
  assert.equal(markMatching({ cpu: 'processes', ram: 'permanent' }, config).marks, 1);
});

test('ordering compares each position with the expected sequence', () => {
  const config = { correctOrder: ['fetch', 'decode', 'execute'], maxMarks: 3, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markOrdering(['fetch', 'decode', 'execute'], config).status, 'correct');
  assert.equal(markOrdering(['decode', 'fetch', 'execute'], config).marks, 1);
});

test('categorisation awards one proportional part per item', () => {
  const config = { correctCategories: { ram: 'volatile', ssd: 'non-volatile' }, maxMarks: 2, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markCategorisation({ ram: 'volatile', ssd: 'non-volatile' }, config).marks, 2);
  assert.equal(markCategorisation({ ram: 'volatile' }, config).marks, 1);
});

test('fill blanks accepts configured variants for each blank', () => {
  const config = { acceptedAnswers: [['ip', 'internet protocol'], ['mac', 'media access control']], caseSensitive: false, maxMarks: 2, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markFillBlanks(['IP', 'media access control'], config).marks, 2);
  assert.equal(markFillBlanks(['ip', 'ram'], config).marks, 1);
});

test('code blanks accept the single token required by fixed surrounding code', () => {
  const config = { acceptedAnswers: [['5'], ['count']], caseSensitive: true, maxMarks: 2, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markFillBlanks(['5', 'count'], config).status, 'correct');
  assert.equal(markFillBlanks(['0, 5', 'count'], config).marks, 1);
});

test('structured fields award proportional credit across tables and diagrams', () => {
  const config = { correctValues: { first: ['yes', 'y'], second: 'no' }, caseSensitive: false, maxMarks: 2, successFeedback: 'Correct', partialFeedback: 'Partial', incorrectFeedback: 'Incorrect' };
  assert.equal(markStructuredFields({ first: 'Y', second: 'no' }, config).status, 'correct');
  assert.equal(markStructuredFields({ first: 'yes', second: 'yes' }, config).marks, 1);
  assert.equal(markStructuredFields({}, config).status, 'unanswered');
});

test('SQL marking normalises syntax safely without changing quoted value case', () => {
  const config = { acceptedQueries: ["SELECT name FROM students WHERE class_name = '10A' ORDER BY name ASC", "SELECT name FROM students WHERE class_name = '10A' ORDER BY name"], maxMarks: 3, successFeedback: 'Correct', incorrectFeedback: 'Incorrect' };
  assert.equal(markSqlQuery(" select name from students where class_name='10A' order by name; ", config).status, 'correct');
  assert.equal(markSqlQuery("SELECT name FROM students WHERE class_name = '10a' ORDER BY name", config).marks, 0);
  assert.equal(markSqlQuery('', config).status, 'unanswered');
  assert.equal(normaliseSql("SELECT  name FROM students;"), 'select name from students');
});

test('extended responses remain pending until rubric review', () => {
  const config = { minimumWords: 10, maxMarks: 6, reviewFeedback: 'Queued for review' };
  assert.equal(markExtendedResponse('Too short', config).status, 'unanswered');
  const submitted = markExtendedResponse('Virtual memory uses secondary storage when available RAM is no longer sufficient.', config);
  assert.equal(submitted.status, 'review');
  assert.equal(submitted.marks, null);
  assert.equal(submitted.maxMarks, 6);
});
