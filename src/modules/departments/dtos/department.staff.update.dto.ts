import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateStaffDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  department?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;
}
