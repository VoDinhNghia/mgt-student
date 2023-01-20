import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop({ required: true })
  title?: string;

  @Prop()
  content?: Text;

  @Prop({ required: true })
  type?: string;

  @Prop()
  url?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
