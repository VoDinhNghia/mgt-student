import { ApiPropertyOptional } from '@nestjs/swagger';

export class ItCertificateDto {
  @ApiPropertyOptional()
  attachment: string;

  @ApiPropertyOptional()
  scores: number;
}
