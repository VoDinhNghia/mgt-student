import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMoneyPerCreditMgtDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ default: 520000 })
  moneyPerCredit?: number;

  @ApiPropertyOptional()
  semester?: string;
}
