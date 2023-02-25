import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EscholarshirpType } from 'src/commons/constants';

export type ScholarshipDocument = Scholarship & Document;

@Schema()
export class Scholarship {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @Prop()
  content?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ScholarshipSchema = SchemaFactory.createForClass(Scholarship);
