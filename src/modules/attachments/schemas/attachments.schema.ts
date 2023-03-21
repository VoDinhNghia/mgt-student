import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type AttachmentDocument = Attachment & Document;
// posible save at difference server or amazon s3 service
@Schema()
export class Attachment extends FieldsCommonSchema {
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
    ref: collections.profiles,
  })
  uploadBy?: mongoose.Types.ObjectId;
}

export const AttachmentlSchema = SchemaFactory.createForClass(Attachment);
