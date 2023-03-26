import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type DepartmentStaffDocument = DepartmentStaff & Document;

@Schema({ collection: collections.department_staffs, versionKey: false })
export class DepartmentStaff extends FieldsCommonSchema {
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
  SchemaFactory.createForClass(DepartmentStaff);
