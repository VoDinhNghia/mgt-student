import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AwardDocument = Award & Document;

@Schema()
export class Award {
  @Prop({ required: true })
  name?: string;

  @Prop()
  time?: Date;

  @Prop()
  location?: string;

  @Prop()
  type?: string;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AwardSchema = SchemaFactory.createForClass(Award);
