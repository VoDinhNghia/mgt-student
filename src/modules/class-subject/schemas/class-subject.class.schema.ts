/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type ClassInfosDocument = Class_Infos & Document;

@Schema()
export class Class_Infos extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string; // DHKHMT12A

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.courses,
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.degreelevels,
  })
  degreeLevel?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.majors,
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  homeroomteacher?: mongoose.Types.ObjectId;

  @Prop()
  classSize?: number;
}

export const ClassInfoSchema = SchemaFactory.createForClass(Class_Infos);
