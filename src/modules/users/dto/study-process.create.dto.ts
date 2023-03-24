import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { EstatusUserProfile } from 'src/constants/constant';
import { ItCertificateDto } from './study-process.itCer.dto';
import { ToeicCertificateDto } from './study-process.toeicCer.dto';

export class CreateStudyProcessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: EstatusUserProfile.STUDYING,
    enum: EstatusUserProfile,
  })
  status: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ToeicCertificateDto })
  toeicCertificate?: ToeicCertificateDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ItCertificateDto })
  itCertificate?: ItCertificateDto;
}
