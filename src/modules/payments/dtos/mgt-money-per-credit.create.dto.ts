import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMoneyPerCreditMgtDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsNumber()
  @ApiProperty({ default: 520000, description: 'money per credit' })
  moneyPerCredit?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;
}
