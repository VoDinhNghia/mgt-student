import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EtypeLearningRate } from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SettingLearningRateDocument = SettingLearningRate & Document;

@Schema({
  collection: collections.setting_learning_rate,
  versionKey: false,
})
export class SettingLearningRate extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
    default: 'Pretty',
  })
  name?: string; // pretty, good, excellent, weak, average,

  @Prop({
    required: true,
    default: EtypeLearningRate.TEN_POINT_SCALE,
  })
  type?: string;

  @Prop({ default: 6.5, max: 10, min: 0 })
  minimum?: number;

  @Prop({ default: 7.9, max: 10, min: 0 })
  maximum?: number;
}

export const SettingLearningRateSchema =
  SchemaFactory.createForClass(SettingLearningRate);
