import { ApiProperty } from '@nestjs/swagger';

export class CreateDegreeLevelDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  description?: string;
}
