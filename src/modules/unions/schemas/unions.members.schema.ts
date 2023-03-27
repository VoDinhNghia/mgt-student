import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type UnionMemberDocument = UnionMembers & Document;

@Schema({ collection: collections.unions_members, versionKey: false })
export class UnionMembers extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.unions,
    required: true,
  })
  union?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
  })
  user?: mongoose.Types.ObjectId;

  @Prop()
  position?: string;

  @Prop()
  joinDate?: Date;
}

export const UnionMemberSchema = SchemaFactory.createForClass(UnionMembers);
