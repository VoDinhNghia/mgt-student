import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class IdentityCardNumberDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  date?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;
}
