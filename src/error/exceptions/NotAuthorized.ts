export class NotAuthorized extends Error {
  status = 401;

  constructor(message?: string) {
    super('Not Authorized' + (message ? ` - ${message}` : ''));
  }
}
