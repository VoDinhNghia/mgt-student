import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { StaffDepartmentCommonDto } from './department.staff.dto';

export class CreateStaffDepartmentDto extends StaffDepartmentCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  department?: string;
}
