import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type SubjectDocument = Subjects & Document;

@Schema()
export class Subjects extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  lecturer?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.majors,
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.courses,
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.degreelevels,
  })
  degreeLevel?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.semesters,
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  openTime?: Date;

  @Prop({ default: Date.now })
  closeTime?: Date;

  @Prop({ default: 60 })
  size?: number;

  @Prop({ default: 3 })
  numberCredits?: number; // 3 TC

  @Prop({ default: false })
  elective?: boolean;

  @Prop({ default: true }) // ex: GDTC not calculate cumumalative
  calculateCumulativePoint?: boolean;

  @Prop({ default: 0 })
  numberOfFailed?: number;

  @Prop({ default: 0 })
  numberOfPass?: number;

  @Prop()
  comment?: string;

  @Prop({ default: true })
  status?: boolean; // open: true, close: false
}

export const SubjectSchema = SchemaFactory.createForClass(Subjects);
