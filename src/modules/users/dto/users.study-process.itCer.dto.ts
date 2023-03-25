import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ItCertificateDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  scores: number;
}
