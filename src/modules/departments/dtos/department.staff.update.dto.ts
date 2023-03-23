import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateStaffDepartmentDto {
  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;
}
