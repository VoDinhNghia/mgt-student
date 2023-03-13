import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';
import { ErolesUser, EstatusUser } from '../../../constants/constant';

export type UsersDocument = Users & Document;

@Schema()
export class Users extends FieldsCommonSchema {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passWord: string;

  @Prop({ default: false })
  statusLogin?: boolean;

  @Prop({ default: EstatusUser.ACTIVE })
  status?: string;

  @Prop({ enum: ErolesUser, default: ErolesUser.STUDENT })
  role?: string;

  @Prop()
  historyLogin?: [
    {
      divice: string;
      date: Date;
      host: string;
      origin: string;
    },
  ];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
