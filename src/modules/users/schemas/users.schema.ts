import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';
import { ErolesUser, EstatusUser } from '../../../constants/constant';

export type UsersDocument = Users & Document;

@Schema()
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
