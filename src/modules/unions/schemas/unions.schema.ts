import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type UnionDocument = Union & Document;

@Schema()
export class Union extends FieldsCommonSchema {
  @Prop()
  url?: string;

  @Prop()
  nameUnit?: string;

  @Prop()
  address?: string;

  @Prop()
  mobile?: string;

  @Prop()
  email?: string;

  @Prop()
  introduction?: string;

  @Prop()
  function?: string;

  @Prop({
    type: [
      {
        attachment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: collectionNames.attachments,
        },
        description: String,
      },
    ],
  })
  images?: [
    {
      attachment?: mongoose.Types.ObjectId;
      description?: string;
    },
  ];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: collectionNames.profiles,
        },
        position: String,
      },
    ],
  })
  members?: [
    {
      user?: mongoose.Types.ObjectId;
      position?: string;
    },
  ];
}

export const UnionSchema = SchemaFactory.createForClass(Union);
