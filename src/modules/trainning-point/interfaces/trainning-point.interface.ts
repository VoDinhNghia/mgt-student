import { Types } from 'mongoose';

export interface IqueryTrainningPoint {
  isDeleted?: boolean;
  name?: RegExp;
  user?: Types.ObjectId;
  semester?: Types.ObjectId;
  program?: Types.ObjectId;
}

export interface IqueryVoluntee {
  isDeleted?: boolean;
  name?: RegExp;
  organizingCommittee?: {
    leader?: Types.ObjectId;
    secretary?: Types.ObjectId;
  };
  faculty?: Types.ObjectId;
  semester?: Types.ObjectId;
}

export interface ItrainningPointImport {
  user?: string;
  semester?: string;
  program?: string;
  attendance?: string;
  status?: string;
}

export interface IvolunteeImport {
  faculty?: string;
  semester?: string;
  type?: string;
  leader?: string;
  secretary?: string;
  title?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: string;
  organizingCommittee?: {
    leader?: string;
    secretary?: string;
  };
  code?: string;
}
