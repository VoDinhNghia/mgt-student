import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SemesterDocument = Semester & Document;

@Schema()
export class Semester {
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
