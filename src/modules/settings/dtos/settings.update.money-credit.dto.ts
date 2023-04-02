import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSettingMoneyCreditDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100000000)
  @ApiProperty({ default: 520000 })
  moneyPerCredit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  semester?: string;
}
