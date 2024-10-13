export class AuthError extends Error {
  errorsData?: Record<string, string[]> = {};

  constructor(message: string, errorsData?: Record<string, string[]>) {
    super(message);
    this.name = "AuthError";
    this.errorsData = errorsData;
  }
}
