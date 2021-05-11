import session from 'express-session';

export = session;

declare module 'express-session' {
  interface SessionData {
    user: import('@root/__generatedTypes__').User;
    id: string;
  }
}
