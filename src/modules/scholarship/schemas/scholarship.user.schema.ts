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
  accumalatedPoint?: number;

  @Prop()
  trainningPoint?: number;
  // totalMoney (collection paymentstudyfees) * percentTuition (collection scholarships)
  // rewardMoney will calculate when call api get scholarship

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ScholarshipUserSchema =
  SchemaFactory.createForClass(ScholarshipUser);
