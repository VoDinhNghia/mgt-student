import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type MajorsDocument = Majors & Document;

@Schema()
export class Majors extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.faculties,
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
    ref: collections.awards,
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  headOfSection?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  eputeHead?: mongoose.Types.ObjectId;
}

export const MajorSchema = SchemaFactory.createForClass(Majors);
