import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountriesDocument = Countries & Document;

@Schema()
export class Countries {
  @Prop({ required: true })
  name: string;

  @Prop()
  flag?: string;

  @Prop({ required: true }) // example VN, ...
  countryId: string;

  @Prop()
  capital?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
