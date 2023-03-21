import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments extends FieldsCommonSchema {
  @Prop()
  name?: string;

  @Prop()
  introduction?: string;

  @Prop()
  foundYear?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  manager?: mongoose.Types.ObjectId;

  @Prop({
    type: {
      office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.rooms,
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
    ref: collections.attachments,
  })
  attachment?: [mongoose.Types.ObjectId];
}

export const DepartmentSchema = SchemaFactory.createForClass(Departments);
