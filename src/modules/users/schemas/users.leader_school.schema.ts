import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type LeaderSchoolDocument = LeaderSchool & Document;

@Schema()
export class LeaderSchool {
  @Prop({
    type: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'users',
        },
      },
    ],
  })
  partyCommittee?: [
    {
      user: mongoose.Types.ObjectId;
      acceptDate: Date;
    },
  ];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: 'users',
        },
      },
    ],
  })
  leader?: [
    {
      user: mongoose.Types.ObjectId;
      term: string;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const LeaderSchoolSchema = SchemaFactory.createForClass(LeaderSchool);
