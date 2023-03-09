import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  AdminPermission,
  AdminPermissionSchema,
} from './schemas/permission.admin.acction-frontend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminPermission.name, schema: AdminPermissionSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, ValidateField],
})
export class PermissionsModule {}
