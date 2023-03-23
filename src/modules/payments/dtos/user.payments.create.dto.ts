import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EstatusPayments, EtypePayments } from 'src/constants/constant';

export class CreateUserPaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsNumber()
  @ApiProperty({ default: 0 })
  totalMoney?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: EtypePayments.CASH })
  type?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: EstatusPayments.OWED })
  status?: string;
}
