import { ApiProperty } from '@nestjs/swagger';

export class CreateSemesterDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true, default: '2016-2017' })
  year?: string;
}
