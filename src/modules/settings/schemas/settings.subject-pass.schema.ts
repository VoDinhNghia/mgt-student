import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EtypeSettingSubjectPass } from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SettingSubjectPassDocument = SettingSubjectPass & Document;

@Schema({
  collection: collections.setting_subject_pass,
  versionKey: false,
})
export class SettingSubjectPass extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // Condition accumulated point

  @Prop({
    required: true,
    default: EtypeSettingSubjectPass.ACCUMULATED_POINT,
  })
  type?: string;

  @Prop({ default: 4.0, min: 0, max: 10 }) // >= condition => pass else failed
  condition?: number;
}

export const SettingSubjectPassSchema =
  SchemaFactory.createForClass(SettingSubjectPass);
