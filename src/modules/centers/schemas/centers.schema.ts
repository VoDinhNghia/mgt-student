import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CenterDocument = Center & Document;

@Schema()
export class Center {
  @Prop({ required: true })
  name?: string;

  @Prop()
  introduction?: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'profiles',
  })
  director?: mongoose.Types.ObjectId;

  @Prop()
  foundYear?: string;

  @Prop([
    {
      type: mongoose.Types.ObjectId,
      ref: 'awards',
    },
  ])
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
      },
      email: String,
      phone: String,
      fax: String,
    },
  })
  contacts?: {
    office?: mongoose.Types.ObjectId;
    email?: string;
    phone?: string;
    fax?: string;
  };

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CenterSchema = SchemaFactory.createForClass(Center);
