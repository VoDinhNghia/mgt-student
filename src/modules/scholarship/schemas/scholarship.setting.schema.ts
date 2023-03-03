import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ScholarshipSettingDocument = ScholarshipSettings & Document;

@Schema()
export class ScholarshipSettings {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'scholarships',
  })
  scholarship?: mongoose.Types.ObjectId;

  @Prop({ default: 8.0 })
  accumulatedPoints?: number;

  @Prop({ default: 65 })
  trainningPoints?: number;

  @Prop({ default: 80 })
  percentTuition?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ScholarshipSettingSchema =
  SchemaFactory.createForClass(ScholarshipSettings);
