import { Types } from 'mongoose';

export interface IqueryCenter {
  isDeleted?: boolean;
  name?: RegExp;
  director?: Types.ObjectId;
}
