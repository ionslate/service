export class ResourceNotFound extends Error {
  status = 404;

  constructor(public message: string = '') {
    super(message);
  }
}
