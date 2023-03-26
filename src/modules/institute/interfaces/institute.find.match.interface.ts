import { Types } from 'mongoose';

export interface ImatchFindInstitute {
  $match?: {
    isDeleted?: boolean;
    _id?: Types.ObjectId;
  };
}
