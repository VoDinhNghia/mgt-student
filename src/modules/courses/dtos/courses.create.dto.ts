import { ApiProperty } from '@nestjs/swagger';
import { OutputCourseDto } from './courses.ouput.dto';
import { TrainningTimeCourseDto } from './courses.trainningTime.dto';
export class CourseCreateDto {
  @ApiProperty({ required: true, default: 'DHKHMT12A' })
  name: string;

  @ApiProperty({ required: true, default: '2016-2017' })
  year?: string; // 2016-2017

  @ApiProperty({ required: true, default: 0 })
  total?: number;

  @ApiProperty({ required: true })
  faculty?: string;

  @ApiProperty({ required: true, type: TrainningTimeCourseDto })
  trainingTime?: TrainningTimeCourseDto;

  @ApiProperty({ required: true, type: OutputCourseDto })
  output?: OutputCourseDto;
}
