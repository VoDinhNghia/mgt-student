import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMoneyPerCreditMgtDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 520000 })
  moneyPerCredit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  semester?: string;
}
