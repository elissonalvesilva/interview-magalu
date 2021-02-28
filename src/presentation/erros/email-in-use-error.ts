export class EmailInUseError extends Error {
  constructor(email: string) {
    super(`Email: ${email} already in use`);
    this.name = 'EmailInUseError';
  }
}
