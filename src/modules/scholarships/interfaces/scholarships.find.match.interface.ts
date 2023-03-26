import { Types } from 'mongoose';

export interface ImatchFindAllScholarship {
  $match?: {
    _id?: Types.ObjectId;
    isDeleted?: boolean;
    semester?: Types.ObjectId;
    type?: string;
    $or?: [{ name?: RegExp }];
    scholarship?: Types.ObjectId;
    user?: Types.ObjectId;
  };
}
