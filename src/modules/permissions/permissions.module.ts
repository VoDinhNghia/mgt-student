import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  AdminPermission,
  AdminPermissionSchema,
} from './schemas/permissions.admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminPermission.name, schema: AdminPermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
