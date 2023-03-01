import { ApiProperty } from '@nestjs/swagger';

export class ItCertificateDto {
  @ApiProperty({ required: false })
  attachment: string;

  @ApiProperty({ required: false })
  scores: number;
}
