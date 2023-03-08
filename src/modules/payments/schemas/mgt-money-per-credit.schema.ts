import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MoneyPerCreditManagementDocument = MoneyPerCreditManagement &
  Document;

@Schema()
export class MoneyPerCreditManagement {
  @Prop({
    type: String,
    required: true,
  })
  name?: string;

  @Prop({
    type: Number,
    required: true,
  })
  moneyPerCredit?: number; // money per credit

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const MoneyPerCreditManagementSchema = SchemaFactory.createForClass(
  MoneyPerCreditManagement,
);
