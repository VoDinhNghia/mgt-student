import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FacultyDocument = Faculty & Document;

@Schema()
export class Faculty {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'awards',
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profiles',
    },
  })
  headOfSection?: mongoose.Types.ObjectId;

  @Prop({
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profiles',
    },
  })
  eputeHead?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
