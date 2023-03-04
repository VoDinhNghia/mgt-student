import { ApiProperty } from '@nestjs/swagger';

export class CreateMoneyPerCreditMgtDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true, default: 520000 })
  moneyPerCredit?: number; // money per credit

  @ApiProperty({ required: true })
  semester?: string;
}
