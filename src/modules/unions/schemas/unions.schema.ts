import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type UnionDocument = Union & Document;

@Schema({ collection: collections.unions, versionKey: false })
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
}

export const UnionSchema = SchemaFactory.createForClass(Union);
