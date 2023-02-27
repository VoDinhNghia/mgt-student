import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubjectDocument = Subjects & Document;

@Schema()
export class Subjects {
  @Prop({ required: true })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  lecturer?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'majors',
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'degreelevels',
  })
  degreelevel?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  openTime?: Date;

  @Prop({ default: Date.now })
  closeTime?: Date;

  @Prop({ default: 60 })
  size?: number;

  @Prop({ default: 3 })
  numberCredits?: number; // 3 TC

  @Prop({ default: 0 })
  numberOfFailed?: number;

  @Prop({ default: 0 })
  numberOfPass?: number;

  @Prop()
  comment?: string;

  @Prop({ default: true })
  status?: boolean; // open: true, close: false

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SubjectSchema = SchemaFactory.createForClass(Subjects);
