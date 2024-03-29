import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';
import { ErolesUser, EstatusUser } from '../../../constants/constant';

export type UsersDocument = Users & Document;

@Schema({ collection: collections.users, versionKey: false })
export class Users extends FieldsCommonSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  passWord: string;

  @Prop({ default: false })
  statusLogin?: boolean;

  @Prop({ default: EstatusUser.ACTIVE })
  status?: string;

  @Prop({ enum: ErolesUser, default: ErolesUser.STUDENT })
  role?: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
