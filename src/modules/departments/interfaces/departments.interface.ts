import { Types } from 'mongoose';

export interface IqueryDeparment {
  isDeleted?: boolean;
  manager?: Types.ObjectId;
  name?: RegExp;
}

export interface IprofileStaff {
  _id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  isDelete?: boolean;
  user?: {
    _id?: Types.ObjectId;
    role?: string;
    email?: string;
    status?: string;
  };
}
