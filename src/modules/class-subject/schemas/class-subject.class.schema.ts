import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type ClassInfosDocument = ClassInfos & Document;

@Schema({ collection: collections.class_infos, versionKey: false })
export class ClassInfos extends FieldsCommonSchema {
  @Prop({ required: true })
  name?: string; // DHKHMT12A

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.courses,
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.degreelevels,
  })
  degreeLevel?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.majors,
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  homeroomteacher?: mongoose.Types.ObjectId;

  @Prop()
  classSize?: number;
}

export const ClassInfoSchema = SchemaFactory.createForClass(ClassInfos);
