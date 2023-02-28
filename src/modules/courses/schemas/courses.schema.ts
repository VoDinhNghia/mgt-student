import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
