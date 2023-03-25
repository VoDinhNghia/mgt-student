import { PartialType } from '@nestjs/swagger';
import { CreateUserPaymentDto } from './payments.users.create.dto';

export class UpdateUserPaymentDto extends PartialType(CreateUserPaymentDto) {}
