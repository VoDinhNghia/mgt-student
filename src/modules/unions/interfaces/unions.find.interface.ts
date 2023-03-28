import { Types } from 'mongoose';
import { Igroup } from 'src/utils/utils.interface';

export interface IimageList {
  _id?: Types.ObjectId;
  attachment?: {
    _id?: Types.ObjectId;
    originalname?: string;
    filename?: string;
    url?: string;
  };
  description?: string;
}

export interface IqueryUnion {
  isDeleted?: boolean;
  nameUnit?: RegExp;
}
export interface IunionFindAll {
  _id?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  isDeleted?: boolean;
  url?: string;
  nameUnit?: string;
  address?: string;
  mobile?: string;
  email?: string;
  introduction?: string;
  function?: string;
  updatedBy?: Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
  groupMember?: Igroup[];
  imageList?: IimageList[];
}

export interface IunionImageQuery {
  isDeleted?: boolean;
  union?: Types.ObjectId;
  description?: RegExp;
}

export interface IunionMemberQuery {
  isDeleted?: boolean;
  union?: Types.ObjectId;
  user?: Types.ObjectId;
  position?: RegExp;
}
