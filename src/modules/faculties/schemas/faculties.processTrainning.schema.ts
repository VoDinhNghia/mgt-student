import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type FacultyTrainningProcessDocument = FacultyTrainningProcess &
  Document;

@Schema({
  collection: collections.faculty_trainning_processes,
  versionKey: false,
})
export class FacultyTrainningProcess extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.faculties,
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.courses,
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
}

export const FacultyTrainningProcessSchema = SchemaFactory.createForClass(
  FacultyTrainningProcess,
);
