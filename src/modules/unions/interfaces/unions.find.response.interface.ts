import { Types } from 'mongoose';

export interface Igroup {
  _id: string;
  count: number;
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
  groupMember?: Igroup[];
}
