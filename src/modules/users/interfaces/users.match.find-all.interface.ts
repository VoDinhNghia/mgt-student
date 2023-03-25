import { Types } from 'mongoose';

export interface ImatchFindAllUser {
  $match?: {
    _id?: {
      $ne?: Types.ObjectId;
    };
    isDeleted: boolean;
    role?: string;
    status?: string;
  };
}
