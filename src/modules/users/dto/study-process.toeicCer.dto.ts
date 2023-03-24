import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class ToeicCertificateDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  scores: number;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  expirationDate: Date;
}
