/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collectionNames, Epermission } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';

export type AdminPermissionDocument = Admin_Permission & Document;

@Schema()
export class Admin_Permission extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
    required: true,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  moduleName?: string;

  @Prop({ required: true, default: [Epermission.ONLY_VIEW] })
  permission?: [string];
}

export const AdminPermissionSchema =
  SchemaFactory.createForClass(Admin_Permission);
