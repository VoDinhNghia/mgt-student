import { ApiProperty } from '@nestjs/swagger';
import { StaffDepartmentCommonDto } from './department.staff.dto';

export class CreateStaffDepartmentDto extends StaffDepartmentCommonDto {
  @ApiProperty({ required: true })
  department?: string;
}
