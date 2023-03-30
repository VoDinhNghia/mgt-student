import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type CountriesDocument = Countries & Document;

@Schema({ collection: collections.countries, versionKey: false })
export class Countries extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  flag?: string;

  @Prop({ required: true, unique: true }) // example vn, ...
  countryId: string;

  @Prop()
  capital?: string;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
