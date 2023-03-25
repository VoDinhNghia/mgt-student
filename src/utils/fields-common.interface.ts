import { Document } from 'mongoose';

export interface IschemaCommon extends Document {
  _id?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
