import { ApiProperty } from '@nestjs/swagger';
import { StaffDepartmentCommonDto } from './department.staff.dto';

export class CreateMultiStaffDepartmentDto {
  @ApiProperty({ required: true, type: [StaffDepartmentCommonDto] })
  staffs?: StaffDepartmentCommonDto[];

  @ApiProperty({ required: true })
  department?: string;
}
