export class ResourceNotFound extends Error {
  status = 404;

  constructor(message?: string) {
    super('Resource Not Found' + (message ? ` - ${message}` : ''));
  }
}
