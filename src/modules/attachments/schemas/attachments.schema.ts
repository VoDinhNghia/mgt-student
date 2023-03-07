import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema()
export class Attachment {
  @Prop()
  originalname?: string;

  @Prop()
  filename?: string;

  @Prop()
  path?: string;

  @Prop()
  destination?: string;

  @Prop()
  mimetype?: string;

  @Prop()
  url?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  uploadBy?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AttachmentlSchema = SchemaFactory.createForClass(Attachment);
