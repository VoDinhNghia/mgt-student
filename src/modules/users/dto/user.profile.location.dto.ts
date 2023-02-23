import { ApiProperty } from '@nestjs/swagger';

export class LocationProfileDto {
  @ApiProperty({ required: false })
  province?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  permanentAddress?: string;

  @ApiProperty({ required: false })
  temporaryAddress?: string;
}
