import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { EstatusUserProfile } from 'src/constants/constant';
import { ToeicCertificateDto } from './study-process.toeicCer.dto';
import { ItCertificateDto } from './study-process.itCer.dto';

export class UpdateStudyProcessDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EstatusUserProfile,
    default: EstatusUserProfile.STUDYING,
  })
  status?: string;

  @IsOptional()
  @IsObject()
  @Type(() => ToeicCertificateDto)
  @ApiProperty({ type: ToeicCertificateDto })
  toeicCertificate?: ToeicCertificateDto;

  @IsOptional()
  @IsObject()
  @Type(() => ItCertificateDto)
  @ApiProperty({ type: ItCertificateDto })
  itCertificate?: ItCertificateDto;
}
