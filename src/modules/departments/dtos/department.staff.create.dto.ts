import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDepartmentDto {
  @ApiProperty({ required: true })
  department?: string;

  @ApiProperty({ required: true })
  staff?: string;

  @ApiProperty({ required: true })
  joinDate?: string;
}
