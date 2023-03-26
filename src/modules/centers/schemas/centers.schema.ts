import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type CenterDocument = Center & Document;

@Schema({ collection: collections.centers, versionKey: false })
export class Center extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string;

  @Prop()
  introduction?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  director?: mongoose.Types.ObjectId;

  @Prop()
  foundYear?: Date;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.awards,
    },
  ])
  award?: [mongoose.Types.ObjectId];

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
}

export const CenterSchema = SchemaFactory.createForClass(Center);
