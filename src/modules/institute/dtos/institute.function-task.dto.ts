import { ApiProperty } from '@nestjs/swagger';

export class FunctionAndTaskInstituteDto {
  @ApiProperty({ required: true })
  title?: string;

  @ApiProperty({ required: true })
  content?: string;
}
