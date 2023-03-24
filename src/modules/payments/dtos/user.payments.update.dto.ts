import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EstatusPayments, EtypePayments } from 'src/constants/constant';

export class UpdateUserPaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsNumber()
  @Type(() => Number)
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
