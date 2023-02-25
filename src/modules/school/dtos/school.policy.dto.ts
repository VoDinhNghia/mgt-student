import { ApiProperty } from '@nestjs/swagger';

export class PoliCySchoolDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, default: '2023-02-25' })
  effectiveDate?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ required: false })
  attachment?: string;
}
