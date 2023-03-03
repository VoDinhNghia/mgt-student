import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { getRandomCode } from 'src/utils/generateCodeProfile';

export type PaymentStudyFeeDocument = PaymentStudyFee & Document;

@Schema()
export class PaymentStudyFee {
  @Prop({
    default: getRandomCode(5),
    required: true,
  })
  receiptId?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  totalMoney?: number;

  @Prop({
    type: {
      description: String,
      bank: String,
      numberAccount: Number,
      type: String,
    },
  })
  payments?: {
    description?: string;
    bank?: string;
    numberAccount?: number;
    type?: string; // online, direct
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop()
  status?: boolean;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const PaymentStudyFeeSchema =
  SchemaFactory.createForClass(PaymentStudyFee);
