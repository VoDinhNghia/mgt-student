import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
