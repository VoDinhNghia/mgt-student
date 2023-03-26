import { Types } from 'mongoose';

export interface ImatchFindBranch {
  $match?: {
    _id?: Types.ObjectId;
    isDeleted?: boolean;
    name?: RegExp;
  };
}
