import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ type: ToeicCertificateDto })
  toeicCertificate?: ToeicCertificateDto;

  @ApiPropertyOptional({ type: ItCertificateDto })
  itCertificate?: ItCertificateDto;
}
