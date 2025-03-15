import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    // This extends the Request interface in Express
    export interface Request {
      user?: IUser;
    }
  }
} 