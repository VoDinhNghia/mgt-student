import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PaymentStudyFeeDocument = PaymentStudyFee & Document;

@Schema()
export class PaymentStudyFee {
  @Prop({
    type: Number, // random
    required: true,
  })
  receiptId?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  user?: mongoose.Types.ObjectId;

  // When registering for a course, the data will be synchronized with this table to create and update
  @Prop({
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjects',
    },
  })
  subjectList?: [
    {
      subject?: mongoose.Types.ObjectId;
      total?: number; // Total amount to pay for this course (ex: 3TC * Amount per credit)
    },
  ];

  @Prop()
  payments?: {
    description?: string;
    bank?: string;
    numberAccount?: number;
    type?: string;
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
  })
  semester?: mongoose.Types.ObjectId;

  @Prop()
  status?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const PaymentStudyFeeSchema =
  SchemaFactory.createForClass(PaymentStudyFee);
