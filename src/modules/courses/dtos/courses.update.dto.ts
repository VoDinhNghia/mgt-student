import { ApiProperty } from '@nestjs/swagger';
export class UpdateCourseDto {
  @ApiProperty({ required: false, default: 'DHKHMT12A' })
  name: string;

  @ApiProperty({ required: false, default: '2016-2017' })
  year?: string; // 2016-2017

  @ApiProperty({ required: false, default: 0 })
  total?: number;
}
