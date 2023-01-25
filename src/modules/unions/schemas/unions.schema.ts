import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UnionDocument = Union & Document;

@Schema()
export class Union {
  @Prop()
  url?: string;

  @Prop()
  nameUnit?: string;

  @Prop()
  address?: string;

  @Prop()
  mobile?: string;

  @Prop()
  email?: string;

  @Prop()
  introduction?: string;

  @Prop()
  function?: string;

  @Prop({
    attachment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'attachments',
    },
  })
  image?: [
    {
      attachment?: mongoose.Types.ObjectId;
      description?: string;
    },
  ];

  @Prop({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  })
  member?: [
    {
      user?: mongoose.Types.ObjectId;
      position?: string;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const UnionSchema = SchemaFactory.createForClass(Union);
