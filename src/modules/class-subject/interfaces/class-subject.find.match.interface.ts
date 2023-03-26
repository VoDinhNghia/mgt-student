import { Types } from 'mongoose';

export interface ImatchFindClassSubject {
  $match?: {
    _id?: Types.ObjectId;
    isDeleted?: boolean;
  };
}
