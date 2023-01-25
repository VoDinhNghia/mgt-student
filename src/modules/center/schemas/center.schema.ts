import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CenterDocument = Center & Document;

@Schema()
export class Center {
  @Prop({ required: true })
  name?: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'rooms',
  })
  room?: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        header: {
          type: mongoose.Types.ObjectId,
          ref: 'user',
        },
        listLecture: [
          {
            type: mongoose.Types.ObjectId,
            ref: 'user',
          },
        ],
      },
    ],
  })
  hummanResource?: {
    header: mongoose.Types.ObjectId;
    listLecture?: [mongoose.Types.ObjectId];
  };

  @Prop()
  founding?: Date;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'awards',
  })
  award?: mongoose.Types.ObjectId;

  @Prop()
  contact?: [
    {
      email?: string;
      fax?: string;
      mobile?: string;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CenterSchema = SchemaFactory.createForClass(Center);
