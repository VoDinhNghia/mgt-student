import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DepartmentStaffDocument = DepartmentStaff & Document;

@Schema()
export class DepartmentStaff {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'departments',
  })
  department?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  staff?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  joinDate?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DepartmentStaffSchema =
  SchemaFactory.createForClass(DepartmentStaff);
