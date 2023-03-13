import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type CountriesDocument = Countries & Document;

@Schema()
export class Countries extends FieldsCommonSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  flag?: string;

  @Prop({ required: true }) // example VN, ...
  countryId: string;

  @Prop()
  capital?: string;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
