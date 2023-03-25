import { Types } from 'mongoose';

export interface ImatchFindFaculty {
  $match?: {
    isDeleted?: boolean;
    _id?: Types.ObjectId;
    name?: RegExp;
    faculty?: Types.ObjectId;
  };
}
