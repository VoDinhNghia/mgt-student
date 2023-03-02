import { ApiProperty } from '@nestjs/swagger';
import { EstatusUserProfile } from 'src/constants/constant';
import { ItCertificateDto } from './study-process.itCer.dto';
import { ToeicCertificateDto } from './study-process.toeicCer.dto';

export class CreateStudyProcessDto {
  @ApiProperty({ required: true })
  user?: string;

  @ApiProperty({
    required: true,
    default: EstatusUserProfile.STUDYING,
    enum: EstatusUserProfile,
  })
  status: string;

  @ApiProperty({ required: false, type: ToeicCertificateDto })
  toeicCertificate?: ToeicCertificateDto;

  @ApiProperty({ required: false, type: ItCertificateDto })
  itCertificate?: ItCertificateDto;
}
