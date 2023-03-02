import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeAward } from 'src/constants/constant';

export type AwardDocument = Award & Document;

@Schema()
export class Award {
  @Prop({ required: true })
  name?: string;

  @Prop({ default: Date.now })
  time?: Date;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop()
  location?: string;

  @Prop()
  type?: EtypeAward;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AwardSchema = SchemaFactory.createForClass(Award);
