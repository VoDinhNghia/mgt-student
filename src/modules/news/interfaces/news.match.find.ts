import { Types } from 'mongoose';

export interface ImatchFindNews {
  $match?: {
    isDeleted?: boolean;
    type?: string;
    _id?: Types.ObjectId;
  };
}
