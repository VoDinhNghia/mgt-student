/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type MoneyPerCreditManagementDocument = Money_Per_Credit_Mgt & Document;

@Schema()
export class Money_Per_Credit_Mgt extends FieldsCommonSchema {
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
    ref: collections.semesters,
  })
  semester?: mongoose.Types.ObjectId;
}

export const MoneyPerCreditManagementSchema =
  SchemaFactory.createForClass(Money_Per_Credit_Mgt);
