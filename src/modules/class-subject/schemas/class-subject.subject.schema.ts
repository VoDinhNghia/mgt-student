import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubjectDocument = Subjects & Document;

@Schema()
export class Subjects {
  @Prop({ required: true })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  lecturer?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculty',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'degreelevel',
  })
  degreelevel?: mongoose.Types.ObjectId;

  @Prop()
  openTime?: Date;

  @Prop()
  closeTime?: Date;

  @Prop({ type: Object })
  schedule?: {
    learnDate?: Date; // Monday
    time?: string; // 8h - 10h A.M
    startDate?: Date;
    endDate?: Date;
    semester?: mongoose.Types.ObjectId;
    process?: mongoose.Types.ObjectId; // will have collection for schedule subject.
  };

  @Prop()
  size?: number;

  @Prop()
  numberCredits?: number; // 3 TC

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop()
  numberOfFailed?: number;

  @Prop()
  numberOfPass?: number;

  @Prop()
  comment?: string;

  @Prop()
  status?: boolean; // open: true, close: false

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SubjectSchema = SchemaFactory.createForClass(Subjects);
