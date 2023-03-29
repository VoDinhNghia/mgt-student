import { Types } from 'mongoose';

export interface ImatchFindPermission {
  isDeleted?: boolean;
  type?: string;
  user?: Types.ObjectId;
  moduleName?: RegExp;
}
