import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateStaffDepartmentDto {
  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({
    required: false,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  joinDate?: Date;
}
