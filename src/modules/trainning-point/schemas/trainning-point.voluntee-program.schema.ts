import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  EtypeVolunteeProgram,
  lengthRandomCodeVoluntee,
} from 'src/constants/constant';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';
import { getRandomCodeVoluntee } from 'src/utils/utils.generate.code';

export type VolunteeProgramsDocument = VolunteePrograms & Document;

@Schema({ collection: collections.voluntee_programs, versionKey: false })
export class VolunteePrograms extends FieldsCommonSchema {
  @Prop({
    required: true,
    default: getRandomCodeVoluntee(lengthRandomCodeVoluntee),
    unique: true,
  })
  code?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.faculties,
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.semesters,
    required: true,
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: EtypeVolunteeProgram.FACULTY })
  type?: string;

  @Prop({
    required: true,
  })
  title?: string;

  @Prop()
  description?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  location?: string;

  @Prop({ default: true })
  status?: boolean; // true => open, false => close

  @Prop({ required: true })
  point?: number;

  @Prop()
  numberMember?: number;

  @Prop({
    type: {
      leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.profiles,
      },
      secretary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.profiles,
      },
    },
  })
  organizingCommittee?: {
    leader?: mongoose.Types.ObjectId;
    secretary?: mongoose.Types.ObjectId;
  };
}

export const VolunteeProgramsSchema =
  SchemaFactory.createForClass(VolunteePrograms);
