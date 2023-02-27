import { ApiProperty } from '@nestjs/swagger';
import { OutputCourseDto } from './courses.ouput.dto';
import { TrainningTimeCourseDto } from './courses.trainningTime.dto';
export class UpdateCourseDto {
  @ApiProperty({ required: false, default: 'DHKHMT12A' })
  name: string;

  @ApiProperty({ required: false, default: '2016-2017' })
  year?: string; // 2016-2017

  @ApiProperty({ required: false, default: 0 })
  total?: number;

  @ApiProperty({ required: false })
  faculty?: string;

  @ApiProperty({ required: false, type: TrainningTimeCourseDto })
  trainingTime?: TrainningTimeCourseDto;

  @ApiProperty({ required: false, type: OutputCourseDto })
  output?: OutputCourseDto;
}
