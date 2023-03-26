import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SemesterDocument = Semester & Document;

@Schema()
export class Semester extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // HK I

  @Prop({
    type: String,
    required: true,
  })
  year?: string; // 2016 - 2017
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
