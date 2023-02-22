import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubjectProcessDocument = SubjectProcess & Document;

@Schema()
export class SubjectProcess {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  lecturer?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
  })
  subject?: mongoose.Types.ObjectId;

  @Prop({
    type: Object,
  })
  midTermTest?: {
    week?: number;
    time?: number; // 60'
    outPut?: string; // content test
    percent?: string; // 30%
  };

  @Prop({ type: Object })
  finalExam?: {
    week?: number;
    time?: number; // 60'
    outPut?: string; // content Test
    percent?: string; // 50%
  };

  @Prop({ type: Object })
  studentEssay?: {
    week?: number;
    time?: number; // 60'
    outPut?: string; // content Test
    percent?: string; // 20%
  };

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SubjectProcessSchema =
  SchemaFactory.createForClass(SubjectProcess);
