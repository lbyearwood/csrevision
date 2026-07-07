import type { StudentProfile } from '../types/domain';

const STUDENT_EMAIL_DOMAIN = 'students.local';

export function sanitizeUsernamePart(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function buildUsernameStem(firstName: string, surname: string): string {
  const firstInitial = sanitizeUsernamePart(firstName).slice(0, 1);
  const cleanSurname = sanitizeUsernamePart(surname);
  return `${firstInitial}${cleanSurname}`.slice(0, 24);
}

export function sanitizeUsername(value: string): string {
  return sanitizeUsernamePart(value).slice(0, 32);
}

export function studentUsernameToEmail(username: string): string {
  return `${sanitizeUsername(username)}@${STUDENT_EMAIL_DOMAIN}`;
}

export function generateUsernameCandidate(
  firstName: string,
  surname: string,
  randomFourDigits = Math.floor(1000 + Math.random() * 9000).toString(),
): string {
  return `${buildUsernameStem(firstName, surname)}${randomFourDigits}`;
}

export function suggestUsernames(
  firstName: string,
  surname: string,
  existingUsernames: string[],
  count = 3,
  seedDigits = ['4821', '6392', '1748', '9051', '2864', '6031', '7392'],
): string[] {
  const existing = new Set(existingUsernames.map(sanitizeUsername));
  const stem = buildUsernameStem(firstName, surname);
  const suggestions: string[] = [];

  for (const digits of seedDigits) {
    const candidate = `${stem}${digits}`;
    if (!existing.has(candidate) && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
    if (suggestions.length === count) break;
  }

  let suffix = 1000;
  while (suggestions.length < count && suffix <= 9999) {
    const candidate = `${stem}${suffix}`;
    if (!existing.has(candidate) && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
    suffix += 1;
  }

  return suggestions;
}

export function generatePublicStudentId(existingIds: string[], digits = 4): string {
  const max = 10 ** digits - 1;
  const min = 10 ** (digits - 1);
  const existing = new Set(existingIds.map((id) => id.replace(/\D/g, '')));

  for (let value = min; value <= max; value += 1) {
    const candidate = String(value);
    if (!existing.has(candidate)) return candidate;
  }

  throw new Error(`No available ${digits}-digit Student IDs remain`);
}

export function leaderboardName(student: Pick<StudentProfile, 'firstName' | 'surname'>): string {
  return `${student.firstName.slice(0, 1).toUpperCase()} ${student.surname}`;
}

export function leaderboardDisplay(
  student: Pick<StudentProfile, 'firstName' | 'surname' | 'publicStudentId'>,
): string {
  return `${leaderboardName(student)} - ID ${student.publicStudentId}`;
}
