import { Types } from 'mongoose';

export interface IqueryFaculty {
  isDeleted?: boolean;
  name?: RegExp;
  type?: string;
}

export interface IqueryMajor {
  isDeleted?: boolean;
  name?: RegExp;
  type?: string;
  faculty?: Types.ObjectId;
}
