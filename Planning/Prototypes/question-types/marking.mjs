function result(status, marks, maxMarks, feedback) {
  return { status, marks, maxMarks, feedback };
}

export function normaliseText(value, options = {}) {
  const { caseSensitive = false } = options;
  const collapsed = String(value ?? '').trim().replace(/\s+/g, ' ');
  return caseSensitive ? collapsed : collapsed.toLocaleLowerCase('en-GB');
}

export function markSingleChoice(answer, config) {
  if (!answer) return result('unanswered', 0, config.maxMarks, 'Choose one answer before checking.');
  const correct = answer === config.correctAnswer;
  return result(correct ? 'correct' : 'incorrect', correct ? config.maxMarks : 0, config.maxMarks, correct ? config.successFeedback : config.incorrectFeedback);
}

export function markMultipleSelect(answer, config) {
  const selected = new Set(answer ?? []);
  if (!selected.size) return result('unanswered', 0, config.maxMarks, 'Choose at least one answer before checking.');
  const expected = new Set(config.correctAnswers);
  const correctSelections = [...selected].filter((value) => expected.has(value)).length;
  const incorrectSelections = [...selected].filter((value) => !expected.has(value)).length;
  const exact = selected.size === expected.size && correctSelections === expected.size;

  if (exact) return result('correct', config.maxMarks, config.maxMarks, config.successFeedback);
  if (config.partialMarks) {
    const creditRatio = Math.max(0, correctSelections - incorrectSelections) / expected.size;
    const marks = Math.min(config.maxMarks, Math.round(creditRatio * config.maxMarks * 100) / 100);
    if (marks > 0) return result('partial', marks, config.maxMarks, config.partialFeedback);
  }
  return result('incorrect', 0, config.maxMarks, config.incorrectFeedback);
}

export function markShortText(answer, config) {
  const received = normaliseText(answer, config);
  if (!received) return result('unanswered', 0, config.maxMarks, 'Enter an answer before checking.');
  const accepted = config.acceptedAnswers.map((value) => normaliseText(value, config));
  const correct = accepted.includes(received);
  return result(correct ? 'correct' : 'incorrect', correct ? config.maxMarks : 0, config.maxMarks, correct ? config.successFeedback : config.incorrectFeedback);
}

export function markNumeric(answer, config) {
  const rawValue = String(answer?.value ?? '').trim();
  if (!rawValue) return result('unanswered', 0, config.maxMarks, 'Enter a number before checking.');
  const received = Number(rawValue);
  if (!Number.isFinite(received)) return result('incorrect', 0, config.maxMarks, 'Enter a valid number.');
  const unitMatches = !config.requiredUnit || normaliseText(answer?.unit) === normaliseText(config.requiredUnit);
  const valueMatches = Math.abs(received - config.expectedValue) <= config.tolerance;
  const correct = unitMatches && valueMatches;
  const feedback = correct
    ? config.successFeedback
    : !unitMatches
      ? `Use the required unit: ${config.requiredUnit}.`
      : config.incorrectFeedback;
  return result(correct ? 'correct' : 'incorrect', correct ? config.maxMarks : 0, config.maxMarks, feedback);
}

function proportionalResult(correctParts, totalParts, config) {
  if (!totalParts || correctParts === totalParts) return result('correct', config.maxMarks, config.maxMarks, config.successFeedback);
  const marks = Math.round((correctParts / totalParts) * config.maxMarks * 100) / 100;
  if (marks > 0) return result('partial', marks, config.maxMarks, config.partialFeedback);
  return result('incorrect', 0, config.maxMarks, config.incorrectFeedback);
}

export function markMatching(answer, config) {
  const received = answer ?? {};
  const keys = Object.keys(config.correctPairs);
  if (!keys.some((key) => received[key])) return result('unanswered', 0, config.maxMarks, 'Complete at least one match before checking.');
  const correctParts = keys.filter((key) => received[key] === config.correctPairs[key]).length;
  return proportionalResult(correctParts, keys.length, config);
}

export function markOrdering(answer, config) {
  if (!Array.isArray(answer) || !answer.length) return result('unanswered', 0, config.maxMarks, 'Arrange the steps before checking.');
  const correctParts = config.correctOrder.filter((value, index) => answer[index] === value).length;
  return proportionalResult(correctParts, config.correctOrder.length, config);
}

export function markCategorisation(answer, config) {
  const received = answer ?? {};
  const keys = Object.keys(config.correctCategories);
  if (!keys.some((key) => received[key])) return result('unanswered', 0, config.maxMarks, 'Assign at least one item before checking.');
  const correctParts = keys.filter((key) => received[key] === config.correctCategories[key]).length;
  return proportionalResult(correctParts, keys.length, config);
}

export function markFillBlanks(answer, config) {
  const received = Array.isArray(answer) ? answer : [];
  if (!received.some((value) => normaliseText(value, config))) return result('unanswered', 0, config.maxMarks, 'Complete at least one blank before checking.');
  const correctParts = config.acceptedAnswers.reduce((count, accepted, index) => {
    const normalisedAnswer = normaliseText(received[index], config);
    const normalisedAccepted = accepted.map((value) => normaliseText(value, config));
    return count + Number(normalisedAccepted.includes(normalisedAnswer));
  }, 0);
  return proportionalResult(correctParts, config.acceptedAnswers.length, config);
}

export function markStructuredFields(answer, config) {
  const received = answer ?? {};
  const keys = Object.keys(config.correctValues);
  if (!keys.some((key) => normaliseText(received[key], config))) {
    return result('unanswered', 0, config.maxMarks, 'Complete at least one field before checking.');
  }
  const correctParts = keys.filter((key) => {
    const expectedValues = Array.isArray(config.correctValues[key]) ? config.correctValues[key] : [config.correctValues[key]];
    const normalisedAnswer = normaliseText(received[key], config);
    return expectedValues.map((value) => normaliseText(value, config)).includes(normalisedAnswer);
  }).length;
  return proportionalResult(correctParts, keys.length, config);
}

export function normaliseSql(value) {
  const withoutTrailingSemicolon = String(value ?? '').trim().replace(/;+\s*$/, '');
  const parts = withoutTrailingSemicolon.split(/('(?:''|[^'])*')/);
  const caseNormalised = parts.map((part, index) => index % 2 === 0 ? part.toLowerCase() : part).join('');
  return caseNormalised
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*=\s*/g, ' = ')
    .trim();
}

export function markSqlQuery(answer, config) {
  const received = normaliseSql(answer);
  if (!received) return result('unanswered', 0, config.maxMarks, 'Write a query before checking.');
  const accepted = config.acceptedQueries.map(normaliseSql);
  const correct = accepted.includes(received);
  return result(correct ? 'correct' : 'incorrect', correct ? config.maxMarks : 0, config.maxMarks, correct ? config.successFeedback : config.incorrectFeedback);
}

export function markExtendedResponse(answer, config) {
  const words = String(answer ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length < config.minimumWords) {
    return result('unanswered', 0, config.maxMarks, `Write at least ${config.minimumWords} words before submitting for review.`);
  }
  return result('review', null, config.maxMarks, config.reviewFeedback);
}
