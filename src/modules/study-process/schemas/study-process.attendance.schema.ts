import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeAttendance } from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type SubjectAttendanceDocument = SubjectAttendance & Document;

@Schema({ collection: collections.subject_attendances, versionKey: false })
export class SubjectAttendance extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.subject_registers,
    required: true,
  })
  subjectRegister: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.subjects,
    required: true,
  })
  subject: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ default: EtypeAttendance.MANUAL })
  type?: string; // face recognition system, manual, biometric ...

  @Prop()
  enterTime?: Date; // only use type face recognition and biometric

  @Prop()
  getoutTime?: Date; // only use type face recognition and biometric
}

export const SubjectAttendanceSchema =
  SchemaFactory.createForClass(SubjectAttendance);
