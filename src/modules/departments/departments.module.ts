import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Departments, DepartmentSchema } from './schemas/departments.schema';
import {
  DepartmentStaff,
  DepartmentStaffSchema,
} from './schemas/departments.staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Departments.name,
        schema: DepartmentSchema,
      },
      { name: DepartmentStaff.name, schema: DepartmentStaffSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
