import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
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
          type: mongoose.Types.ObjectId,
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
          type: mongoose.Types.ObjectId,
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
