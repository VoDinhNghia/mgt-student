import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDegreeLevelDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;
}
