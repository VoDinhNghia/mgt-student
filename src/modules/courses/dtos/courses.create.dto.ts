import { ApiProperty } from '@nestjs/swagger';
export class CreateCourseDto {
  @ApiProperty({ required: true, default: 'K12' })
  name: string;

  @ApiProperty({ required: true, default: '2016-2017' })
  year?: string; // 2016-2017

  @ApiProperty({ required: true, default: 0 })
  total?: number;
}
