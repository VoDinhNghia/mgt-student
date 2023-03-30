import { Types } from 'mongoose';

export interface ImatchSubject {
  $match?: {
    _id?: Types.ObjectId;
    isDeleted?: boolean;
    name?: RegExp;
    major?: Types.ObjectId;
    degreeLevel?: Types.ObjectId;
    lecturer?: Types.ObjectId;
    semester?: Types.ObjectId;
    course?: Types.ObjectId;
  };
}

export interface IqueryClasses {
  isDeleted?: boolean;
  name?: RegExp;
  major?: Types.ObjectId;
  degreeLevel?: Types.ObjectId;
  homeroomteacher?: Types.ObjectId;
  course?: Types.ObjectId;
}
