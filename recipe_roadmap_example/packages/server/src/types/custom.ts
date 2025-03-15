import { Request } from 'express';
import { IUser } from '../models/user.model';

// Custom request interface that includes user property
export interface RequestWithUser extends Request {
  user?: IUser;
} 