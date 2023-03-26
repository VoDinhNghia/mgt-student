import { Types } from 'mongoose';

export interface ImatchFindPermission {
  $match?: {
    isDeleted?: boolean;
    name?: RegExp;
    type?: string;
    user?: Types.ObjectId;
    $or?: [
      { moduleName?: RegExp },
      { 'user.firstName'?: RegExp },
      { 'user.lastName'?: RegExp },
    ];
  };
}
