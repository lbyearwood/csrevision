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

export function generateTemporaryPassword(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `Learn${suffix}!`;
}
