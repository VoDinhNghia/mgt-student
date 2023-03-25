import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  Money_Per_Credit_Mgt,
  MoneyPerCreditManagementSchema,
} from './schemas/payments.mgt-money-per-credit.schema';
import {
  Payment_Study_Fee,
  PaymentStudyFeeSchema,
} from './schemas/payments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Money_Per_Credit_Mgt.name,
        schema: MoneyPerCreditManagementSchema,
      },
      { name: Payment_Study_Fee.name, schema: PaymentStudyFeeSchema },
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
