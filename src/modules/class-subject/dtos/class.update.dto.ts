import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiProperty({ required: false })
  course?: string;

  @ApiProperty({ required: false, default: 'DHKHMT12A' })
  name?: string;

  @ApiProperty({ required: false })
  degreeLevel?: string;

  @ApiProperty({ required: false, default: 50 })
  classSize?: number;

  @ApiProperty({ required: false })
  major?: string;

  @ApiProperty({ required: false })
  homeroomteacher?: string;
}
