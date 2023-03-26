import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StaffDepartmentCommonDto } from './department.staff.dto';

export class CreateMultiStaffDepartmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StaffDepartmentCommonDto)
  @ApiProperty({ type: [StaffDepartmentCommonDto] })
  staffs?: StaffDepartmentCommonDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  department?: string;
}
