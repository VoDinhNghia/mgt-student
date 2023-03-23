import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiPropertyOptional()
  course?: string;

  @ApiPropertyOptional({ default: 'DHKHMT12A' })
  name?: string;

  @ApiPropertyOptional()
  degreeLevel?: string;

  @ApiPropertyOptional({ default: 50 })
  classSize?: number;

  @ApiPropertyOptional()
  major?: string;

  @ApiPropertyOptional()
  homeroomteacher?: string;
}
