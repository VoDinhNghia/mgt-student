/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type FacultyTrainningProcessDocument = Faculty_Trainning_Process &
  Document;

@Schema()
export class Faculty_Trainning_Process extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.faculties,
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.courses,
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
  Faculty_Trainning_Process,
);
