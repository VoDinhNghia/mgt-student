import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { Epermission } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';

export type AdminPermissionDocument = AdminPermission & Document;

@Schema({ collection: collections.admin_permissions, versionKey: false })
export class AdminPermission extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.profiles,
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  moduleName?: string;

  @Prop({ required: true, default: [Epermission.ONLY_VIEW] })
  permission?: [string];
}

export const AdminPermissionSchema =
  SchemaFactory.createForClass(AdminPermission);
