import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubjectProcessDocument = SubjectProcess & Document;

@Schema()
export class SubjectProcess {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
  })
  subject?: mongoose.Types.ObjectId;

  @Prop()
  learnDate?: string; // Monday

  @Prop()
  time?: string; // 8h - 10h A.M

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({
    type: {
      week: Number,
      time: Number,
      output: String,
      percent: Number,
      examDate: Date,
    },
  })
  midTermTest?: {
    week?: number;
    time?: number; // 60'
    output?: string; // content test
    percent?: number; // 30% / 100%
    examDate?: Date;
  };

  @Prop({
    type: {
      week: Number,
      time: Number,
      output: String,
      percent: Number,
      examDate: Date,
    },
  })
  finalExam?: {
    week?: number;
    time?: number; // 60'
    output?: string; // content Test
    percent?: string; // 50%
    examDate?: Date;
  };

  @Prop({
    type: {
      week: Number,
      time: Number,
      output: String,
      percent: Number,
      examDate: Date,
    },
  })
  studentEssay?: {
    week?: number;
    time?: number; // 60'
    output?: string; // content Test
    percent?: string; // 20%
    examDate?: number;
  };

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SubjectProcessSchema =
  SchemaFactory.createForClass(SubjectProcess);
