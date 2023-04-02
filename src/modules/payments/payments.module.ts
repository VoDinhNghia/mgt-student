import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  MoneyPerCreditMgt,
  MoneyPerCreditManagementSchema,
} from './schemas/payments.mgt-money-per-credit.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeSchema,
} from './schemas/payments.schema';
import {
  StudyProcessSchema,
  StudyProcesses,
} from '../study-process/schemas/study-process.schema';
import {
  SubjectRegisterSchema,
  SubjectRegisters,
} from '../study-process/schemas/study-process.subject.schema';
import {
  SubjectSchema,
  Subjects,
} from '../class-subject/schemas/class-subject.subject.schema';
import { SubjectUserRegister } from 'src/utils/utils.user.register-subject.query';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MoneyPerCreditMgt.name,
        schema: MoneyPerCreditManagementSchema,
      },
      { name: PaymentStudyFee.name, schema: PaymentStudyFeeSchema },
      { name: Semester.name, schema: SemesterSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: StudyProcesses.name, schema: StudyProcessSchema },
      { name: SubjectRegisters.name, schema: SubjectRegisterSchema },
      { name: Subjects.name, schema: SubjectSchema },
    ]),
  ],
  providers: [PaymentsService, SubjectUserRegister],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
