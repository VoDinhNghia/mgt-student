import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
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
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
