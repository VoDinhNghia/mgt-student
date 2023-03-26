import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type BlogDocument = Blog & Document;

@Schema({ collection: collections.blogs, versionKey: false })
export class Blog extends FieldsCommonSchema {
  @Prop({ required: true })
  title?: string;

  @Prop()
  content?: string;

  @Prop()
  type?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.attachments,
  })
  images?: [mongoose.Types.ObjectId];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: collections.profiles,
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
          ref: collections.profiles,
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
