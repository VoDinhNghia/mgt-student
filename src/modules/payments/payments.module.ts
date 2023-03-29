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
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
