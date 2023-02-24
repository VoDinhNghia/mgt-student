import { ApiProperty } from '@nestjs/swagger';

export class UpdateSemesterDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, default: '2016-2017' })
  year?: string;
}
