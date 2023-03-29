import { Types } from 'mongoose';

export interface ImatchScholarshipUser {
  $match?: {
    _id?: Types.ObjectId;
    isDeleted?: boolean;
    semester?: Types.ObjectId;
    scholarship?: Types.ObjectId;
    user?: Types.ObjectId;
  };
}

export interface IsemesterQueryScholarship {
  _id?: Types.ObjectId;
  isDeleted?: boolean;
  semester?: Types.ObjectId;
  type?: string;
  $or?: [{ name?: RegExp }, { year?: RegExp }];
}
