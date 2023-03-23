import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class StaffDepartmentCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  staff?: string;

  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;
}
