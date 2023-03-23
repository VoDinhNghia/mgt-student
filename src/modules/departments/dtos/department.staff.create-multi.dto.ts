import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { StaffDepartmentCommonDto } from './department.staff.dto';

export class CreateMultiStaffDepartmentDto {
  @IsArray()
  @ApiProperty({ type: [StaffDepartmentCommonDto] })
  staffs?: StaffDepartmentCommonDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  department?: string;
}
