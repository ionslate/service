export class Forbidden extends Error {
  status = 403;

  constructor(message?: string) {
    super('Forbidden' + (message ? ` - ${message}` : ''));
  }
}
