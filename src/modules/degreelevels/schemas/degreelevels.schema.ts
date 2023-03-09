import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DegreeLevelDocument = DegreeLevel & Document;

@Schema()
export class DegreeLevel {
  @Prop({
    type: String,
    required: true,
  })
  name?: string; // ĐH, CĐ, Th.S, TS...

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DegreeLevelSchema = SchemaFactory.createForClass(DegreeLevel);
