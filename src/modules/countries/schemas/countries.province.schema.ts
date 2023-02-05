import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProvinceDocument = Provinces & Document;

@Schema()
export class Provinces {
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ProvinceSchema = SchemaFactory.createForClass(Provinces);
