import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type MoneyPerCreditManagementDocument = MoneyPerCreditMgt & Document;

@Schema({ collection: collections.money_per_credit_mgts, versionKey: false })
export class MoneyPerCreditMgt extends FieldsCommonSchema {
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
  SchemaFactory.createForClass(MoneyPerCreditMgt);
