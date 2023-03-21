import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments {
  @Prop()
  name?: string;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  manager?: mongoose.Types.ObjectId;

  @Prop({
    type: {
      office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionNames.rooms,
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
    ref: collectionNames.attachments,
  })
  attachment?: [mongoose.Types.ObjectId];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Departments);
