export class Forbidden extends Error {
  status = 404;

  constructor(message?: string) {
    super('Forbidden' + (message ? ` - ${message}` : ''));
  }
}
