import { Types } from 'mongoose';

export interface IquerySettings {
  isDeleted?: boolean;
  name?: RegExp;
}

export interface IqueryMoneyCredit {
  isDeleted?: boolean;
  semester?: Types.ObjectId;
  name?: RegExp;
}
