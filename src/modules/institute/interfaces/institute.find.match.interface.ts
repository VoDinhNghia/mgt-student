import { Types } from 'mongoose';

export interface IqueryInstitute {
  isDeleted?: boolean;
  parson?: Types.ObjectId;
  unitName?: RegExp;
}
