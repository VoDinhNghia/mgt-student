import { ApiProperty } from '@nestjs/swagger';

export class FunctionAndTaskDepartmentDto {
  @ApiProperty({ required: true })
  title?: string;

  @ApiProperty({ required: true })
  content?: string;
}
