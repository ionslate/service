interface ValidationError {
  field?: string;
  message?: string;
}

export class BadRequest extends Error {
  status = 400;

  constructor(public validationError?: ValidationError, message?: string) {
    super('Bad Request' + (message ? ` - ${message}` : ''));
  }
}
