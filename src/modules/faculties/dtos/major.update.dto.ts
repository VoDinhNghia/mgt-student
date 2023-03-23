import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateMajorDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  faculty?: string;

  @ApiPropertyOptional()
  introduction?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  foundYear?: Date;

  @ApiPropertyOptional({ type: [String] })
  award?: [string];

  @ApiPropertyOptional()
  headOfSection?: string;

  @ApiPropertyOptional()
  eputeHead?: string;
}
