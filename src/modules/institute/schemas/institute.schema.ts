import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type InstitudeDocument = Institudes & Document;

@Schema()
export class Institudes extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  unitName?: string;

  @Prop()
  url?: string;

  @Prop({ default: Date.now })
  foundYear?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  parson?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
  })
  viceParson?: mongoose.Types.ObjectId;

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
}

export const InstitudeSchema = SchemaFactory.createForClass(Institudes);
