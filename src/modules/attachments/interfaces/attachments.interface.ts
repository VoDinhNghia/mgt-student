import { Types } from 'mongoose';

export interface IqueryAttachments {
  originalname?: RegExp;
  mimetype?: string;
  uploadBy?: Types.ObjectId;
}
