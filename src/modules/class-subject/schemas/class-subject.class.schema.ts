/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type ClassInfosDocument = Class_Infos & Document;

@Schema()
export class Class_Infos extends FieldsCommonSchema {
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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'majors',
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  homeroomteacher?: mongoose.Types.ObjectId;

  @Prop()
  classSize?: number;
}

export const ClassInfoSchema = SchemaFactory.createForClass(Class_Infos);
