import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type DegreeLevelDocument = DegreeLevel & Document;

@Schema({ collection: collections.degreelevels, versionKey: false })
export class DegreeLevel extends FieldsCommonSchema {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // ĐH, CĐ, Th.S, TS...

  @Prop()
  description?: string;
}

export const DegreeLevelSchema = SchemaFactory.createForClass(DegreeLevel);
