import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
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
  @Type(() => Number)
  @Min(0)
  @Max(100000000)
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
