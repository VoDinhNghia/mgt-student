import { ApiProperty } from '@nestjs/swagger';
import { CreateStaffDepartmentDto } from './department.staff.create.dto';

export class CreateMultiStaffDepartmentDto {
  @ApiProperty({ required: true, type: [CreateStaffDepartmentDto] })
  staffs?: CreateStaffDepartmentDto[];

  @ApiProperty({ required: true })
  department?: string;
}
