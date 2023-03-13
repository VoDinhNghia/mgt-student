import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog extends FieldsCommonSchema {
  @Prop({ required: true })
  title?: string;

  @Prop()
  content?: string;

  @Prop()
  type?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'attachments',
  })
  images?: [mongoose.Types.ObjectId];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'profiles',
        },
      },
    ],
  })
  comments?: [
    {
      user: mongoose.Types.ObjectId;
      content: string;
    },
  ];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'profiles',
        },
      },
    ],
  })
  likes?: [
    {
      user: mongoose.Types.ObjectId;
      status: boolean; // true like, false dislike
      emotion: string; // link path in folder public to get url
    },
  ];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
