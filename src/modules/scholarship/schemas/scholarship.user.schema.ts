import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ScholarshipUserDocument = ScholarshipUser & Document;

@Schema()
export class ScholarshipUser {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'scholarships',
  })
  scholarship?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  user?: mongoose.Types.ObjectId;

  @Prop()
  point?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ScholarshipUserSchema =
  SchemaFactory.createForClass(ScholarshipUser);
