import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudySubjectProcessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  studyprocess?: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: true })
  statusRegister?: boolean; // true: register success.
}
