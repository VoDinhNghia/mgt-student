import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SubjectProcessDocument = SubjectProcess & Document;

@Schema({ collection: collections.subject_processes, versionKey: false })
export class SubjectProcess extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.subjects,
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
    percent?: number; // 50%
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
    percent?: number; // 20%
    examDate?: Date;
  };
}

export const SubjectProcessSchema =
  SchemaFactory.createForClass(SubjectProcess);
