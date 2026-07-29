export interface StudentPerformancePdfInput {
  studentName: string;
  className: string;
  courseName: string;
  average: number | undefined;
  marksEarned: number;
  marksAvailable: number;
  completedTests: number;
  totalTests: number;
  bestScore: number | undefined;
  totalPoints: number;
  results: Array<{
    unitName: string;
    testName: string;
    status: string;
    score: string;
    points: number | undefined;
  }>;
}

function clean(value: string): string {
  return value
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '*')
    .replace(/[()\\]/g, (character) => `\\${character}`)
    .replace(/[^\x20-\x7E]/g, '');
}

function wrap(value: string, length = 84): string[] {
  const words = clean(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > length && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function escape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function downloadStudentPerformancePdf(input: StudentPerformancePdfInput): void {
  const lines = [
    'CS Revision - Student performance summary',
    input.studentName,
    `Class: ${input.className}`,
    `Course: ${input.courseName}`,
    '',
    `Course average: ${typeof input.average === 'number' ? `${input.average}%` : '-'}`,
    `Total marks: ${input.marksEarned}/${input.marksAvailable}`,
    `Tests completed: ${input.completedTests}/${input.totalTests}`,
    `Best score: ${typeof input.bestScore === 'number' ? `${input.bestScore}%` : '-'}`,
    `Total points: ${input.totalPoints}`,
    '',
    'Test breakdown',
    ...input.results.flatMap((result, index) => [
      ...(index === 0 || input.results[index - 1].unitName !== result.unitName ? ['', `Unit: ${result.unitName}`] : []),
      ...wrap(result.testName),
      `Status: ${result.status} | Score: ${result.score} | Points: ${typeof result.points === 'number' ? result.points : '-'}`,
      '',
    ]),
  ];
  const linesPerPage = 44;
  const pages = Array.from({ length: Math.max(1, Math.ceil(lines.length / linesPerPage)) }, (_, index) => lines.slice(index * linesPerPage, (index + 1) * linesPerPage));
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${4 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  pages.forEach((page, index) => {
    const content = ['BT', '/F1 11 Tf', '50 800 Td', ...page.flatMap((line, lineIndex) => [lineIndex ? '0 -17 Td' : '', `(${escape(line)}) Tj`]).filter(Boolean), 'ET'].join('\n');
    const pageObject = 4 + index * 2;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageObject + 1} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${input.studentName.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'student'}-performance-summary.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
