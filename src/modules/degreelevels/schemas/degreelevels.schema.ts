import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type DegreeLevelDocument = DegreeLevel & Document;

@Schema()
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
