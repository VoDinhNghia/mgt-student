import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type ProvinceDocument = Provinces & Document;

@Schema()
export class Provinces extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries',
    required: true,
  })
  countryId: mongoose.Types.ObjectId;

  @Prop()
  phoneCode?: string;

  @Prop()
  codename?: string;

  @Prop()
  capital?: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Provinces);
