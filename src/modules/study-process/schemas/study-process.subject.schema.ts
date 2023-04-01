import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SubjectRegisterDocument = SubjectRegisters & Document;

@Schema({ collection: collections.subject_registers, versionKey: false })
export class SubjectRegisters extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.subjects,
    required: true,
  })
  subject?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.study_processes,
    required: true,
  })
  studyprocess?: mongoose.Types.ObjectId;

  @Prop({ default: true })
  statusRegister?: boolean; // true: register success.

  @Prop()
  midtermScore?: number;

  @Prop()
  finalScore?: number;

  @Prop()
  accumalatedPoint?: number; // if attendance absent > 3 then 0 (check finalScore when create);

  @Prop()
  status: string;

  @Prop()
  essayScore?: number;
}

export const SubjectRegisterSchema =
  SchemaFactory.createForClass(SubjectRegisters);
