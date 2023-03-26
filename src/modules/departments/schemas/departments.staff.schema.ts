/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type DepartmentStaffDocument = Department_Staff & Document;

@Schema()
export class Department_Staff extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.departments,
  })
  department?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  staff?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  joinDate?: Date;
}

export const DepartmentStaffSchema =
  SchemaFactory.createForClass(Department_Staff);
