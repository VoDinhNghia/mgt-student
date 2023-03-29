import { Types } from 'mongoose';

export interface IqueryMgtMoneyPerCredit {
  isDeleted?: boolean;
  semester?: Types.ObjectId;
  name?: RegExp;
}
