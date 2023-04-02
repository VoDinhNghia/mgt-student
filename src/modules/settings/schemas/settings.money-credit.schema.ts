import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SettingMoneyCreditDocument = SettingMoneyCredit & Document;

@Schema({ collection: collections.management_money_credit, versionKey: false })
export class SettingMoneyCredit extends FieldsCommonSchema {
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

export const SettingMoneyCreditSchema =
  SchemaFactory.createForClass(SettingMoneyCredit);
