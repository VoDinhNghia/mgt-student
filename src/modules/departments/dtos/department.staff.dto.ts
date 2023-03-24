import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class StaffDepartmentCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  staff?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;
}
