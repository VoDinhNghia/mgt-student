import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ErolesEnum, statusUser } from '../../../commons/constants';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passWord: string;

  @Prop({ default: false })
  statusLogin?: string;

  @Prop({ default: statusUser.ACTIVE })
  status?: string;

  @Prop({ enum: ErolesEnum, default: ErolesEnum.STUDENT })
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
