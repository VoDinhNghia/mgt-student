import { ApiProperty } from '@nestjs/swagger';

export class UpdateDegreeLevelDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;
}
