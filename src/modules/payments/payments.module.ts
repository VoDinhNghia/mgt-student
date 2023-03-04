import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from 'src/constants/dbConnection';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  CreditManagement,
  CreditManagementSchema,
} from './schemas/creditManagement.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeSchema,
} from './schemas/payments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditManagement.name, schema: CreditManagementSchema },
      { name: PaymentStudyFee.name, schema: PaymentStudyFeeSchema },
    ]),
  ],
  providers: [PaymentsService, DbConnection],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
