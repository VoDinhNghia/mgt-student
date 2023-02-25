import { ApiProperty } from '@nestjs/swagger';

export class ContactSchoolDto {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  fax?: string;

  @ApiProperty({ required: false })
  mobile?: string;
}
