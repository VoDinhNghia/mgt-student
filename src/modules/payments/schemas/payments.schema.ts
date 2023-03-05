import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EstatusPayments, EtypePayments } from 'src/constants/constant';
import { getRandomCodeReceiptId } from 'src/utils/generateCodePayment';

export type PaymentStudyFeeDocument = PaymentStudyFee & Document;

@Schema()
export class PaymentStudyFee {
  @Prop({
    default: getRandomCodeReceiptId(4),
    required: true,
    unique: true,
  })
  receiptId?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  user?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  totalMoney?: number;

  @Prop({ default: EtypePayments.CASH })
  type?: string;

  @Prop({
    type: {
      description: String,
      bank: String,
      numberAccount: Number,
    },
  })
  paymentOnline?: {
    description?: string;
    bank?: string;
    numberAccount?: number;
  };

  @Prop({ default: EstatusPayments.OWED })
  status?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const PaymentStudyFeeSchema =
  SchemaFactory.createForClass(PaymentStudyFee);
