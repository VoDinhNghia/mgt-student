import { Types } from 'mongoose';

export interface ImatchFindAllUser {
  $match?: {
    _id?: {
      $ne?: Types.ObjectId;
    };
    isDeleted?: boolean;
    role?: string | { $ne: string };
    status?: string;
    user?: Types.ObjectId;
  };
}

export interface IqueryLeaderSchool {
  isDeleted?: boolean;
  user?: Types.ObjectId;
}
