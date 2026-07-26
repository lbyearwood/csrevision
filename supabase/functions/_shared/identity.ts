export function sanitizeUsernamePart(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function buildUsernameStem(firstName: string, surname: string): string {
  return `${sanitizeUsernamePart(firstName).slice(0, 1)}${sanitizeUsernamePart(surname)}`.slice(0, 24);
}

export function syntheticStudentEmail(username: string): string {
  return `${sanitizeUsernamePart(username)}@students.local`;
}

export function randomFourDigits(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const TEMPORARY_PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export function generateTemporaryPassword(length = 8): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => TEMPORARY_PASSWORD_CHARS[value % TEMPORARY_PASSWORD_CHARS.length]).join('');
}
