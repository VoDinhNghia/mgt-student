import { Types } from 'mongoose';

export interface IqueryNews {
  isDeleted?: boolean;
  type?: string;
  _id?: Types.ObjectId;
  title?: RegExp;
}
