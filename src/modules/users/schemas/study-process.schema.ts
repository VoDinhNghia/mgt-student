import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EstatusUserProfile } from 'src/constants/constant';

export type StudyProcessDocument = StudyProcess & Document;

@Schema()
export class StudyProcess {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const StudyProcessSchema = SchemaFactory.createForClass(StudyProcess);
