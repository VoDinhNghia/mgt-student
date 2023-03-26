import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';

export class IdentityCardNumberDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  date?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;
}
