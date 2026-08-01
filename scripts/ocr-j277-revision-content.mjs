/* global process */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const OCR_REVISION_SUPPLEMENT_KEYS = Object.freeze({
  logicGates: 'logic_gates_reference',
  flowchartSymbols: 'flowchart_symbols_reference',
});

const breakdownPath = resolve(process.cwd(), 'Planning/Curriculum/OCR_J277_SPEC_TO_APP_STRUCTURE_BREAKDOWN.txt');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractObjectives(lines, startIndex) {
  const objectives = [];
  let currentObjective = '';

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    const numberedLine = line.match(/^\d+\.\s+(.+)$/);

    if (numberedLine) {
      if (currentObjective) objectives.push(currentObjective);
      currentObjective = numberedLine[1].trim();
      continue;
    }

    if (currentObjective && /^\s{2,}\S/.test(line)) {
      currentObjective += ` ${line.trim()}`;
      continue;
    }

    if (currentObjective) {
      objectives.push(currentObjective);
      break;
    }
  }

  return objectives;
}

export function parseOcrRevisionContent(source) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const topics = [];

  for (let index = 0; index < lines.length - 3; index += 1) {
    const heading = lines[index].match(/^([1-8]\.\d+) (.+)$/);
    if (!heading || !/^-+$/.test(lines[index + 1])) continue;

    const objectivesHeadingIndex = lines.indexOf('For this topic, students must be able to:', index + 2);
    if (objectivesHeadingIndex < 0 || objectivesHeadingIndex > index + 4) continue;

    const topicName = `${heading[1]} ${heading[2]}`;
    topics.push({
      code: heading[1],
      topicName,
      topicSlug: slugify(topicName),
      objectives: extractObjectives(lines, objectivesHeadingIndex + 1),
      supplementKeys:
        heading[1] === '4.3'
          ? [OCR_REVISION_SUPPLEMENT_KEYS.logicGates]
          : heading[1] === '7.4'
            ? [OCR_REVISION_SUPPLEMENT_KEYS.flowchartSymbols]
            : [],
    });
  }

  return topics;
}

export function validateOcrRevisionContent(topics, expectedTopicNames) {
  if (topics.length !== 41) {
    throw new Error(`Expected 41 OCR revision topic mappings, received ${topics.length}.`);
  }

  const names = new Set();
  const slugs = new Set();

  for (const topic of topics) {
    if (!topic.topicName.trim() || !topic.topicSlug.trim()) {
      throw new Error('OCR revision topic names and slugs must not be blank.');
    }
    if (names.has(topic.topicName) || slugs.has(topic.topicSlug)) {
      throw new Error(`Duplicate OCR revision mapping found for ${topic.topicName}.`);
    }
    names.add(topic.topicName);
    slugs.add(topic.topicSlug);

    if (!topic.objectives.length || topic.objectives.some((objective) => !objective.trim())) {
      throw new Error(`OCR revision objectives must not be blank for ${topic.topicName}.`);
    }
    if (new Set(topic.objectives).size !== topic.objectives.length) {
      throw new Error(`Duplicate OCR revision objectives found for ${topic.topicName}.`);
    }
  }

  if (expectedTopicNames) {
    const expected = new Set(expectedTopicNames);
    const missing = [...expected].filter((topicName) => !names.has(topicName));
    const unexpected = [...names].filter((topicName) => !expected.has(topicName));
    if (expected.size !== 41 || missing.length || unexpected.length) {
      throw new Error(
        `OCR revision mappings do not match the app hierarchy. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`,
      );
    }
  }

  const supplementedTopics = topics.filter((topic) => topic.supplementKeys.length);
  if (
    supplementedTopics.length !== 2 ||
    supplementedTopics.find((topic) => topic.code === '4.3')?.supplementKeys[0] !== OCR_REVISION_SUPPLEMENT_KEYS.logicGates ||
    supplementedTopics.find((topic) => topic.code === '7.4')?.supplementKeys[0] !== OCR_REVISION_SUPPLEMENT_KEYS.flowchartSymbols
  ) {
    throw new Error('Only OCR topics 4.3 and 7.4 may define revision supplements.');
  }

  return topics;
}

const source = readFileSync(breakdownPath, 'utf8');

export const ocrRevisionTopics = validateOcrRevisionContent(parseOcrRevisionContent(source));
export const ocrRevisionContentBySlug = new Map(
  ocrRevisionTopics.map((topic) => [topic.topicSlug, topic]),
);
