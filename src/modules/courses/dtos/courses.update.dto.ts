import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateCourseDto {
  @ApiPropertyOptional({ default: 'DHKHMT12A' })
  name: string;

  @ApiPropertyOptional({ default: '2016-2017' })
  year?: string;

  @ApiPropertyOptional({ default: 0 })
  total?: number;
}
