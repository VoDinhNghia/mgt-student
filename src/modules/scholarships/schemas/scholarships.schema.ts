import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EscholarshirpType } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type ScholarshipDocument = Scholarship & Document;

@Schema()
export class Scholarship extends FieldsCommonSchema {
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

  @Prop({ default: 8.0 })
  minimunPoints?: number;

  @Prop({ default: 8.9 })
  maximunPoints?: number;

  @Prop({ default: 65 })
  trainningPoints?: number;

  @Prop({ default: 12 })
  numberCredit?: number;

  @Prop({ default: 80 })
  percentTuition?: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];
}

export const ScholarshipSchema = SchemaFactory.createForClass(Scholarship);
