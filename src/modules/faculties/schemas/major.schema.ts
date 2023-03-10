import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MajorsDocument = Majors & Document;

@Schema()
export class Majors {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  industryCode?: string; // 52480101 KHMT

  @Prop()
  introduction?: string;

  @Prop({ default: Date.now })
  foundYear?: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  headOfSection?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  eputeHead?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const MajorSchema = SchemaFactory.createForClass(Majors);
