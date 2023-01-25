import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Servicelibrary & Document;

@Schema()
export class Servicelibrary {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  type?: string; // borrow books, magazine, borrow a group room, Reserve your seat in advance

  @Prop()
  cost?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Servicelibrary);
