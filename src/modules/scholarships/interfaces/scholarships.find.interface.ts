import { Types } from 'mongoose';

export interface IsemesterQueryScholarship {
  _id?: Types.ObjectId;
  isDeleted?: boolean;
  semester?: Types.ObjectId;
  type?: string;
  $or?: [{ name?: RegExp }];
}

export interface IqueryUserScholarship {
  _id?: Types.ObjectId;
  isDeleted?: boolean;
  semester?: Types.ObjectId;
  scholarship?: Types.ObjectId;
  user?: Types.ObjectId;
}
export interface IgetUserScholarship {
  _id?: Types.ObjectId;
  createdBy?: Date;
  isDeleted?: boolean;
  accumalatedPoint?: number;
  trainningPoint?: number;
  createdAt?: Date;
  updatedAt?: Date;
  rewardMoney?: number;
  scholarship?: {
    _id?: Types.ObjectId;
    name?: string;
    isDeleted?: boolean;
    type?: string;
    semester?: string;
    percentTuition?: number;
  };
  user?: {
    _id?: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    avatar?: string;
  };
}
