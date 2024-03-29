import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { EscholarshirpType } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type ScholarshipDocument = Scholarship & Document;

@Schema({ collection: collections.scholarships, versionKey: false })
export class Scholarship extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.semesters,
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @Prop()
  content?: string;

  @Prop({ default: 8.0, min: 0, max: 10 })
  minimunPoints?: number;

  @Prop({ default: 8.9, min: 0, max: 10 })
  maximunPoints?: number;

  @Prop({ default: 65, min: 0, max: 100 })
  trainningPoints?: number;

  @Prop({ default: 12, min: 0, max: 50 })
  numberCredit?: number;

  @Prop({ default: 80, min: 0, max: 100 })
  percentTuition?: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: collections.attachments,
  })
  attachment?: [mongoose.Types.ObjectId];
}

export const ScholarshipSchema = SchemaFactory.createForClass(Scholarship);
