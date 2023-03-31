import { Types } from 'mongoose';

export interface IqueryTrainningPoint {
  isDeleted?: boolean;
  name?: RegExp;
  user?: Types.ObjectId;
  semester?: Types.ObjectId;
  program?: Types.ObjectId;
}

export interface IqueryVoluntee {
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
