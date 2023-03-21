/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type ScholarshipUserDocument = Scholarship_User & Document;

@Schema()
export class Scholarship_User extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.scholarships,
  })
  scholarship?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  user?: mongoose.Types.ObjectId;

  @Prop()
  accumalatedPoint?: number;

  @Prop()
  trainningPoint?: number;
}

export const ScholarshipUserSchema =
  SchemaFactory.createForClass(Scholarship_User);
