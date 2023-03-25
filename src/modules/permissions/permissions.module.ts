import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  Admin_Permission,
  AdminPermissionSchema,
} from './schemas/permissions.admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin_Permission.name, schema: AdminPermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
