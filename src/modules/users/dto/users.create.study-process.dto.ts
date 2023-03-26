import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EstatusUserProfile } from 'src/constants/constant';
import { ItCertificateDto } from './users.study-process.itCer.dto';
import { ToeicCertificateDto } from './users.study-process.toeicCer.dto';

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
  @ValidateNested()
  @Type(() => ToeicCertificateDto)
  @ApiProperty()
  toeicCertificate?: ToeicCertificateDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ItCertificateDto)
  @ApiProperty()
  itCertificate?: ItCertificateDto;
}
