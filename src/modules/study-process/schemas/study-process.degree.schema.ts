import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeDegree } from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type DegreeManagementDocument = DegreeManagement & Document;

@Schema({ collection: collections.degree_management, versionKey: false })
export class DegreeManagement extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // Bachelor of Computer Science

  @Prop()
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  user?: mongoose.Types.ObjectId;

  @Prop()
  year?: string; // 2016 - 2020

  @Prop({ default: EtypeDegree.PRETTY })
  type?: string;

  @Prop()
  recognitionDate?: Date;

  @Prop()
  number?: number;
}

export const DegreeManagementSchema =
  SchemaFactory.createForClass(DegreeManagement);
