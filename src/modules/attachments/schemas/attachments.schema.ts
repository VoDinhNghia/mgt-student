import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema()
export class Attachment {
  @Prop()
  originalName?: string;

  @Prop()
  fileName?: string;

  @Prop()
  path?: string;

  @Prop()
  type?: string;

  @Prop()
  url?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  uploadBy?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AttachmentlSchema = SchemaFactory.createForClass(Attachment);
