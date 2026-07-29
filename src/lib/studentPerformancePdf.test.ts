import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadStudentPerformancePdf } from './studentPerformancePdf';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('downloadStudentPerformancePdf', () => {
  it('creates a named PDF containing the course summary and test breakdown', async () => {
    let createdBlob: Blob | undefined;
    const click = vi.fn();
    const remove = vi.fn();
    const link = { href: '', download: '', click, remove } as unknown as HTMLAnchorElement;
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn((blob: Blob) => {
        createdBlob = blob;
        return 'blob:student-summary';
      }),
      revokeObjectURL: vi.fn(),
    });
    vi.spyOn(document, 'createElement').mockReturnValue(link);
    vi.spyOn(document.body, 'appendChild').mockReturnValue(link);

    downloadStudentPerformancePdf({
      studentName: 'A Singh',
      className: '10A Computing',
      courseName: 'OCR GCSE Computer Science',
      average: 74,
      marksEarned: 37,
      marksAvailable: 50,
      completedTests: 4,
      totalTests: 41,
      bestScore: 100,
      totalPoints: 156,
      results: [{ unitName: '1. Programming', testName: 'Programming fundamentals', status: 'Completed', score: '4/5 (80%)', points: 70 }],
    });

    expect(link.download).toBe('A-Singh-performance-summary.pdf');
    expect(click).toHaveBeenCalledOnce();
    expect(createdBlob?.type).toBe('application/pdf');
    expect(createdBlob?.size).toBeGreaterThan(500);
  });
});
