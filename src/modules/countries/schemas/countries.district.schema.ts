import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type DistrictDocument = Districts & Document;

@Schema()
export class Districts extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.countries,
    required: true,
  })
  countryId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.provinces,
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
