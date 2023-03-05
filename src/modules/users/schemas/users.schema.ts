import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ErolesUser, EstatusUser } from '../../../constants/constant';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
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

  @Prop({ default: null })
  createdBy?: string;

  @Prop({ default: null })
  updatedBy?: string;

  @Prop()
  historyLogin?: [
    {
      divice: string;
      date: Date;
      host: string;
      origin: string;
    },
  ];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
