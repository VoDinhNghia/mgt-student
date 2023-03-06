import { ApiProperty } from '@nestjs/swagger';

export class UpdateStaffDepartmentDto {
  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({ required: false })
  joinDate?: string;
}
