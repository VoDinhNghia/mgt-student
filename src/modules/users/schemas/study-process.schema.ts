/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { EstatusUserProfile } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type StudyProcessDocument = Study_Processes & Document;

@Schema()
export class Study_Processes extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    default: EstatusUserProfile.STUDYING,
  })
  status?: string; // Are you still studying or graduating or saving?

  @Prop({
    type: {
      attachment: mongoose.Schema.Types.ObjectId,
      scores: Number,
      expirationDate: Date,
    },
  })
  toeicCertificate?: {
    attachment: mongoose.Types.ObjectId;
    scores: number;
    expirationDate: Date;
  };

  @Prop({
    type: {
      attachment: mongoose.Schema.Types.ObjectId,
      scores: Number,
    },
  })
  itCertificate?: {
    attachment: mongoose.Types.ObjectId;
    scores: number;
  };
}

export const StudyProcessSchema = SchemaFactory.createForClass(Study_Processes);
