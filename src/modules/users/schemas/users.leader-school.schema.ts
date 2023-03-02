import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EtypeLeaderSchool } from 'src/constants/constant';

export type LeaderSchoolDocument = LeaderSchool & Document;

@Schema()
export class LeaderSchool {
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

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const LeaderSchoolSchema = SchemaFactory.createForClass(LeaderSchool);
