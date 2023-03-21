import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type CenterDocument = Center & Document;

@Schema()
export class Center extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string;

  @Prop()
  introduction?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  director?: mongoose.Types.ObjectId;

  @Prop()
  foundYear?: Date;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionNames.awards,
    },
  ])
  award?: [mongoose.Types.ObjectId];

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
}

export const CenterSchema = SchemaFactory.createForClass(Center);
