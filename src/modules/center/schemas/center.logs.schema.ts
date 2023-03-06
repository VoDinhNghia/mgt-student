import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EactionLog } from 'src/constants/constant';

export type CenterLogDocument = CenterLog & Document;

@Schema()
export class CenterLog {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'centers',
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ required: true, default: EactionLog.ADD })
  action?: string;

  @Prop()
  content?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CenterLogSchema = SchemaFactory.createForClass(CenterLog);
