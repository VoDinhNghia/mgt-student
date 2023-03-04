import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}
}
