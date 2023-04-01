import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeSchema,
} from '../payments/schemas/payments.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import {
  StudyProcesses,
  StudyProcessSchema,
} from '../study-process/schemas/study-process.schema';
import { Scholarship, ScholarshipSchema } from './schemas/scholarships.schema';
import {
  ScholarshipUser,
  ScholarshipUserSchema,
} from './schemas/scholarships.user.schema';
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
        name: Attachment.name,
        schema: AttachmentlSchema,
      },
      {
        name: Semester.name,
        schema: SemesterSchema,
      },
      {
        name: StudyProcesses.name,
        schema: StudyProcessSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: PaymentStudyFee.name,
        schema: PaymentStudyFeeSchema,
      },
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
})
export class ScholarshipModule {}
