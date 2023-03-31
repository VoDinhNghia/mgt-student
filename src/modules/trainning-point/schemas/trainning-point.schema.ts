import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type TranningPointsDocument = TrainningPoints & Document;

@Schema({ collection: collections.trainning_points, versionKey: false })
export class TrainningPoints extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.semesters,
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.voluntee_programs,
  })
  program?: mongoose.Types.ObjectId;

  @Prop({ default: false })
  status?: boolean;

  @Prop()
  attendance?: Date;
}

export const TranningPointSchema =
  SchemaFactory.createForClass(TrainningPoints);
