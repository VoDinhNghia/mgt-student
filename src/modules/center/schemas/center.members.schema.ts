import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CenterMemberDocument = CenterMember & Document;

@Schema()
export class CenterMember {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'centers',
  })
  center?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'profiles',
  })
  lecture?: mongoose.Types.ObjectId;

  @Prop()
  joinDate?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CenterMemberSchema = SchemaFactory.createForClass(CenterMember);
