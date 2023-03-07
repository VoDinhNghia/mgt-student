import { ApiProperty } from '@nestjs/swagger';

export class FunctionAndTaskDto {
  @ApiProperty({ required: true })
  title?: string;

  @ApiProperty({ required: true })
  content?: string;
}
