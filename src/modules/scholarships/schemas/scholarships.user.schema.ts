import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type ScholarshipUserDocument = ScholarshipUser & Document;

@Schema({ collection: collections.scholarship_users, versionKey: false })
export class ScholarshipUser extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.scholarships,
  })
  scholarship?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  user?: mongoose.Types.ObjectId;

  @Prop()
  accumalatedPoint?: number;

  @Prop()
  trainningPoint?: number;
}

export const ScholarshipUserSchema =
  SchemaFactory.createForClass(ScholarshipUser);
