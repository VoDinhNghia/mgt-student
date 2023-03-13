import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type FacultyDocument = Faculty & Document;

@Schema()
export class Faculty extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

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
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
