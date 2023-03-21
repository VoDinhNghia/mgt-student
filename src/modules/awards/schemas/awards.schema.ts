import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { EtypeAward } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type AwardDocument = Award & Document;

@Schema()
export class Award extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string;

  @Prop({ default: Date.now })
  time?: Date;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: collections.attachments,
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop({ required: true })
  location?: string;

  @Prop({ default: EtypeAward.UNIVERSITY })
  type?: EtypeAward;

  @Prop()
  description?: string;
}

export const AwardSchema = SchemaFactory.createForClass(Award);
