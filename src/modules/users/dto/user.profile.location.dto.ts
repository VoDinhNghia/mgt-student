import { ApiPropertyOptional } from '@nestjs/swagger';

export class LocationProfileDto {
  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  permanentAddress?: string;

  @ApiPropertyOptional()
  temporaryAddress?: string;
}
