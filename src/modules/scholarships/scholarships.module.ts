import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { Scholarship, ScholarshipSchema } from './schemas/scholarships.schema';
import {
  ScholarshipUser,
  ScholarshipUserSchema,
} from './scholarships.user.schema';
import { ScholarshipController } from './scholarships.controller';
import { ScholarshipService } from './scholarships.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Scholarship.name,
        schema: ScholarshipSchema,
      },
      {
        name: ScholarshipUser.name,
        schema: ScholarshipUserSchema,
      },
      {
        name: Semester.name,
        schema: SemesterSchema,
      },
      {
        name: Attachment.name,
        schema: AttachmentlSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService, DbConnection],
})
export class ScholarshipModule {}
