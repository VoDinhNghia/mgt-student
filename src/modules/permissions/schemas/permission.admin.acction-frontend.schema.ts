import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Epermission } from 'src/constants/constant';

export type AdminPermissionDocument = AdminPermission & Document;

@Schema()
export class AdminPermission {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles',
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  moduleName?: string;

  @Prop({ required: true, default: [Epermission.ONLY_VIEW] })
  permission?: [string];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const AdminPermissionSchema =
  SchemaFactory.createForClass(AdminPermission);
