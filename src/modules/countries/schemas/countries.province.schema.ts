import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type ProvinceDocument = Provinces & Document;

@Schema({ collection: collections.provinces, versionKey: false })
export class Provinces extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.countries,
    required: true,
  })
  countryId: mongoose.Types.ObjectId;

  @Prop()
  phoneCode?: string;

  @Prop({ required: true, unique: true })
  codename?: string;

  @Prop()
  capital?: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Provinces);
