import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';

export class ToeicCertificateDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(990)
  @ApiProperty()
  scores: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  expirationDate: Date;
}
