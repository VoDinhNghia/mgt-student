import { ApiPropertyOptional } from '@nestjs/swagger';

export class ContactSchoolDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  fax?: string;

  @ApiPropertyOptional()
  mobile?: string;
}
