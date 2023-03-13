import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type DistrictDocument = Districts & Document;

@Schema()
export class Districts extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries',
    required: true,
  })
  countryId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provinces',
    required: true,
  })
  provinceId: mongoose.Types.ObjectId;

  @Prop()
  phoneCode?: string;

  @Prop()
  codename?: string;

  @Prop()
  code?: string;
}

export const DistrictSchema = SchemaFactory.createForClass(Districts);
