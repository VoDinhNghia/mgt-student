import { Types } from 'mongoose';

export interface ImatchFindDeparment {
  $match?: {
    isDeleted?: boolean;
    _id?: Types.ObjectId;
  };
}
