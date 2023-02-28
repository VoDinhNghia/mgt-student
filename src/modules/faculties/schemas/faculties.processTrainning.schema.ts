import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FacultyTrainningProcessDocument = FacultyTrainningProcess &
  Document;

@Schema()
export class FacultyTrainningProcess {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  courses?: mongoose.Types.ObjectId;

  @Prop({
    type: {
      maximum: Number,
      minmun: Number,
    },
  })
  trainingTime?: {
    maximum?: number; // 7 year
    minimum?: number; // 3 year
  };

  @Prop({
    type: {
      toeic: String,
      it: {
        type: Boolean,
        default: true,
      },
      conditionDiff: String,
    },
  })
  output?: {
    toeic?: string; // 400, 450, 500 ...
    it?: boolean;
    conditionDiff?: string; // GDTC, GDQP ...
  };

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const FacultyTrainningProcessSchema = SchemaFactory.createForClass(
  FacultyTrainningProcess,
);
