export interface TestSummaryPdfInput {
  title: string;
  percentage: number;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: Array<{
    questionOrder: number;
    questionText: string;
    answerText: string;
    correctAnswerText: string;
    isCorrect: boolean;
    marksAwarded: number;
    maxMarks: number;
  }>;
}

function cleanPdfText(value: string): string {
  return value
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '*')
    .replace(/[()\\]/g, (character) => `\\${character}`)
    .replace(/[^\x20-\x7E]/g, '');
}

function wrap(value: string, length = 88): string[] {
  const words = cleanPdfText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > length && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function escapePdf(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function downloadTestSummaryPdf(input: TestSummaryPdfInput): void {
  const lines = [
    'CS Revision - Test summary',
    input.title,
    `Score: ${input.score} / ${input.maxScore} (${input.percentage}%)`,
    `Correct answers: ${input.correctAnswers} of ${input.totalQuestions}`,
    '',
    ...input.questions.flatMap((question) => [
      `Question ${question.questionOrder}: ${question.isCorrect ? 'Correct' : 'To improve'} (${question.marksAwarded}/${question.maxMarks})`,
      ...wrap(question.questionText),
      ...wrap(`Your answer: ${question.answerText}`),
      ...(question.isCorrect ? [] : wrap(`Correct answer: ${question.correctAnswerText}`)),
      '',
    ]),
  ];
  const pageLineCount = 44;
  const pages = Array.from({ length: Math.max(1, Math.ceil(lines.length / pageLineCount)) }, (_, index) => lines.slice(index * pageLineCount, (index + 1) * pageLineCount));
  const objects: string[] = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${pages.map((_, index) => `${4 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];

  pages.forEach((page, index) => {
    const content = ['BT', '/F1 11 Tf', '50 800 Td', ...page.flatMap((line, lineIndex) => [lineIndex ? '0 -17 Td' : '', `(${escapePdf(line)}) Tj`]).filter(Boolean), 'ET'].join('\n');
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
  link.download = `${input.title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'test'}-summary.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
