import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateFacultyDto {
  @ApiPropertyOptional()
  name?: string;

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
