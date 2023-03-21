/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type DepartmentStaffDocument = Department_Staff & Document;

@Schema()
export class Department_Staff extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.departments,
  })
  department?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  staff?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  joinDate?: Date;
}

export const DepartmentStaffSchema =
  SchemaFactory.createForClass(Department_Staff);
