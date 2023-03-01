import { ApiProperty } from '@nestjs/swagger';

export class ToeicCertificateDto {
  @ApiProperty({ required: false })
  attachment: string;

  @ApiProperty({ required: false })
  scores: number;

  @ApiProperty({ required: false, default: '2023-02-26' })
  expirationDate: string;
}
