import { describe, expect, it } from 'vitest';
import {
  OCR_REVISION_SUPPLEMENT_KEYS,
  ocrRevisionTopics,
  validateOcrRevisionContent,
} from '../scripts/ocr-j277-revision-content.mjs';

describe('OCR revision content', () => {
  it('contains exactly 41 unique, non-empty topic mappings', () => {
    expect(() => validateOcrRevisionContent(ocrRevisionTopics)).not.toThrow();
    expect(ocrRevisionTopics).toHaveLength(41);
    expect(new Set(ocrRevisionTopics.map((topic) => topic.topicSlug)).size).toBe(41);

    for (const topic of ocrRevisionTopics) {
      expect(topic.objectives.length).toBeGreaterThan(0);
      expect(topic.objectives.every((objective) => objective.trim().length > 0)).toBe(true);
      expect(new Set(topic.objectives).size).toBe(topic.objectives.length);
    }
  });

  it('preserves the approved objective order and excludes internal guidance', () => {
    const programmingFundamentals = ocrRevisionTopics.find((topic) => topic.code === '1.1');
    expect(programmingFundamentals?.objectives[0]).toBe('Use variables and constants to store values.');
    expect(programmingFundamentals?.objectives).toContain('Generate and use random integer and real values.');

    const displayedContent = ocrRevisionTopics.flatMap((topic) => topic.objectives).join(' ').toLowerCase();
    expect(displayedContent).not.toContain('string interpolation');
    expect(displayedContent).not.toContain('mapping note');
    expect(displayedContent).not.toContain('not required by ocr');
    expect(displayedContent).not.toContain('assessment administration');
  });

  it('assigns supplements only to 4.3 and 7.4', () => {
    expect(ocrRevisionTopics.filter((topic) => topic.supplementKeys.length)).toEqual([
      expect.objectContaining({ code: '4.3', supplementKeys: [OCR_REVISION_SUPPLEMENT_KEYS.logicGates] }),
      expect.objectContaining({ code: '7.4', supplementKeys: [OCR_REVISION_SUPPLEMENT_KEYS.flowchartSymbols] }),
    ]);
  });
});
