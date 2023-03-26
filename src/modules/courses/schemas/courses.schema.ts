import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type CourseDocument = Course & Document;

@Schema({ collection: collections.courses, versionKey: false })
export class Course extends FieldsCommonSchema {
  @Prop({
    // k12
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  year?: string; // 2016-2017

  @Prop()
  total?: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
