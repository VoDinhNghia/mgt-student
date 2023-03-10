import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class StaffDepartmentCommonDto {
  @ApiProperty({ required: true })
  staff?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  joinDate?: Date;
}
