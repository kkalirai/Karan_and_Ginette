import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    sessionID?: string;
    createdAt: Date;
    lastAccessed: Date;
  }
}
