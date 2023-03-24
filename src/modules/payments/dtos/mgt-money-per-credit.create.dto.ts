import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMoneyPerCreditMgtDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 520000, description: 'money per credit' })
  moneyPerCredit?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;
}
