import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type MajorsDocument = Majors & Document;

@Schema()
export class Majors extends FieldsCommonSchema {
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
}

export const MajorSchema = SchemaFactory.createForClass(Majors);
