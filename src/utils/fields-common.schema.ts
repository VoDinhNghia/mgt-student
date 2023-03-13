import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  updatedBy?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  deletedBy?: mongoose.Types.ObjectId;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;

  @Prop({ required: false })
  deletedAt?: Date;
}
