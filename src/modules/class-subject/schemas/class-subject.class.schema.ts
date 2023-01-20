import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ClassInfosDocument = ClassInfos & Document;

@Schema()
export class ClassInfos {
  @Prop({ required: true })
  name?: string; // DHKHMT12A

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'degreelevels',
  })
  degreeLevel?: mongoose.Types.ObjectId;

  @Prop()
  classSize?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'majors',
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  homeroomteacher?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ClassInfoSchema = SchemaFactory.createForClass(ClassInfos);
