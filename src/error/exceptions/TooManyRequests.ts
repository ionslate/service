export class TooManyRequest extends Error {
  status = 429;

  constructor(public retryAfter: number, message?: string) {
    super('Too Many Requests' + (message ? ` - ${message}` : ''));
  }
}
