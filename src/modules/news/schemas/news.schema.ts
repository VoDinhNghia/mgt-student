import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeNews } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type NewsDocument = News & Document;

@Schema()
export class News extends FieldsCommonSchema {
  @Prop({ required: true })
  title?: string;

  @Prop()
  content?: string;

  @Prop({ required: true, default: EtypeNews.UNIVERSITY })
  type?: string;

  @Prop()
  url?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];
}

export const NewsSchema = SchemaFactory.createForClass(News);
