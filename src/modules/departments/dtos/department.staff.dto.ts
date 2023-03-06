import { ApiProperty } from '@nestjs/swagger';

export class StaffDepartmentCommonDto {
  @ApiProperty({ required: true })
  staff?: string;

  @ApiProperty({ required: true })
  joinDate?: string;
}
