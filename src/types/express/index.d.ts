declare namespace Express {
  export interface Request {
    user?: import('./src/container').User;
  }
}
