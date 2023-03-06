import { ApiProperty } from '@nestjs/swagger';

export class ContactCommonDto {
  @ApiProperty({ required: true })
  office?: string;

  @ApiProperty({ required: true })
  email?: string;

  @ApiProperty({ required: true })
  phone?: string;

  @ApiProperty({ required: false })
  fax?: string;
}
