import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';
import { GenerateCode } from 'src/utils/utils.generate.code';

export type SemesterDocument = Semester & Document;

@Schema({ collection: collections.semesters, versionKey: false })
export class Semester extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // HK I

  @Prop({
    default: new GenerateCode().getRandomCodeSemester(4),
    required: true,
    unique: true,
  })
  code?: string;

  @Prop({
    type: String,
    required: true,
  })
  year?: string; // 2016 - 2017
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
