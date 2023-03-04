import { ApiProperty } from '@nestjs/swagger';

export class UpdateMoneyPerCreditMgtDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, default: 520000 })
  moneyPerCredit?: number; // money per credit

  @ApiProperty({ required: false })
  semester?: string;
}
