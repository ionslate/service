declare namespace Express {
  // export interface Request {
  //   user?: import('./src/container').User;
  // }
  export interface SessionData {
    user: import('./src/container').User;
  }
}
