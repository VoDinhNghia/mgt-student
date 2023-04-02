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
import {
  SubjectSchema,
  Subjects,
} from '../class-subject/schemas/class-subject.subject.schema';
import {
  SubjectRegisterSchema,
  SubjectRegisters,
} from '../study-process/schemas/study-process.subject.schema';
import { SubjectUserRegister } from 'src/utils/utils.user.register-subject.query';
import {
  TrainningPoints,
  TranningPointSchema,
} from '../trainning-point/schemas/trainning-point.schema';

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
      {
        name: Subjects.name,
        schema: SubjectSchema,
      },
      {
        name: SubjectRegisters.name,
        schema: SubjectRegisterSchema,
      },
      {
        name: TrainningPoints.name,
        schema: TranningPointSchema,
      },
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService, SubjectUserRegister],
})
export class ScholarshipModule {}
