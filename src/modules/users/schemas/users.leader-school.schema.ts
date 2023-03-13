/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeLeaderSchool } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type LeaderSchoolDocument = Leader_Schools & Document;

@Schema()
export class Leader_Schools extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  user?: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        name: String,
        acceptDate: Date,
        status: Boolean,
      },
    ],
  })
  title?: [
    {
      name: string; // ex: Secretary, Principal
      acceptDate: Date; // date of appointment to that position
      type: EtypeLeaderSchool;
    },
  ];
}

export const LeaderSchoolSchema = SchemaFactory.createForClass(Leader_Schools);
