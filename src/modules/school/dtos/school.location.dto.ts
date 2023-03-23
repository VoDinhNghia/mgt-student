import { ApiPropertyOptional } from '@nestjs/swagger';

export class LocationSchoolDto {
  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  district?: string;

  @ApiPropertyOptional()
  ward?: string;

  @ApiPropertyOptional()
  address?: string;
}
