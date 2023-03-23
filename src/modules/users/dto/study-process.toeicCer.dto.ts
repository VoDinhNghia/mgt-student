import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class ToeicCertificateDto {
  @ApiPropertyOptional()
  attachment: string;

  @ApiPropertyOptional()
  scores: number;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  expirationDate: string;
}
