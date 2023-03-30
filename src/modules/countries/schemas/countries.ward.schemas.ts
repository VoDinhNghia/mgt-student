import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type WardDocument = Wards & Document;

@Schema({ collection: collections.wards, versionKey: false })
export class Wards extends FieldsCommonSchema {
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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.districts,
    required: true,
  })
  districtId: mongoose.Types.ObjectId;

  @Prop()
  phoneCode?: string;

  @Prop({ required: true, unique: true })
  codename?: string;

  @Prop()
  code?: string;
}

export const WardSchema = SchemaFactory.createForClass(Wards);
