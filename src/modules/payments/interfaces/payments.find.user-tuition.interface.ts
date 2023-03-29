import { Types } from 'mongoose';

export interface IuserRegisterResponse {
  _id?: Types.ObjectId;
  isDeleted?: boolean;
  studyprocess?: Types.ObjectId;
  statusRegister?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  accumalatedPoint?: number;
  essayScore?: number;
  finalScore?: number;
  midtermScore?: number;
  status?: string;
  totalMoney?: number;
  subject?: {
    _id?: Types.ObjectId;
    name?: string;
    numberCredits?: number;
    isDeleted?: boolean;
    createdBy?: Types.ObjectId;
    lecturer?: Types.ObjectId;
    major?: Types.ObjectId;
    course?: Types.ObjectId;
    degreeLevel?: Types.ObjectId;
    semester?: Types.ObjectId;
    openTime?: Date;
    closeTime?: Date;
    size?: number;
    elective?: boolean;
    calculateCumulativePoint?: boolean;
    numberOfFailed?: number;
    numberOfPass?: number;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
