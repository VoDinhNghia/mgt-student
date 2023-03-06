import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments {
  @Prop()
  name?: string;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  manager?: mongoose.Types.ObjectId;

  @Prop({
    type: {
      office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
      },
      email: String,
      phone: String,
      fax: String,
    },
  })
  contacts?: {
    office?: mongoose.Types.ObjectId;
    email?: string;
    phone?: string;
    fax?: string;
  };

  @Prop({
    type: [
      {
        title: String,
        content: String,
      },
    ],
  })
  function?: [
    {
      title?: string;
      content?: string;
    },
  ];

  @Prop({
    type: [
      {
        title: String,
        content: String,
      },
    ],
  })
  task?: [
    {
      title?: string;
      content?: string;
    },
  ];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Departments);
