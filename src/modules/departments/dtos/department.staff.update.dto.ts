import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateStaffDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  department?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;
}
