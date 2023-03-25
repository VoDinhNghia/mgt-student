import { Types } from 'mongoose';

export interface ImatchFindLeaderSchool {
  $match?: {
    user?: Types.ObjectId;
    isDeleted: boolean;
  };
}
