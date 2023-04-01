import { Types } from 'mongoose';

export interface IupdateSubjectRegister {
  accumalatedPoint?: number;
  essayScore?: number;
  finalScore?: number;
  midtermScore?: number;
  status?: string;
  updatedBy?: string;
  updatedAt?: number | Date;
}

export interface ImatchStudyProcess {
  $match?: {
    isDeleted?: boolean;
    user?: Types.ObjectId;
    semester?: Types.ObjectId;
  };
}
