import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from 'src/constants/dbConnection';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';
import { Scholarship, ScholarshipSchema } from './schemas/scholarship.schema';
import {
  ScholarshipUser,
  ScholarshipUserSchema,
} from './schemas/scholarship.user.schema';
import { ScholarshipController } from './scholarship.controller';
import { ScholarshipService } from './scholarship.service';

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
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService, DbConnection],
})
export class ScholarshipModule {}
