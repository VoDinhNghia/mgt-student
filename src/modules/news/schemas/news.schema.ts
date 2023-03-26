import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { EtypeNews } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type NewsDocument = News & Document;

@Schema({ collection: collections.news, versionKey: false })
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
    ref: collections.attachments,
  })
  attachment?: [mongoose.Types.ObjectId];
}

export const NewsSchema = SchemaFactory.createForClass(News);
