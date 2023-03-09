import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ActionAdminLogDocument = ActionAdminLog & Document;

@Schema()
export class ActionAdminLog {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  action?: string; // ex: delete userId `id_name`

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const ActionAdminLogSchema =
  SchemaFactory.createForClass(ActionAdminLog);
