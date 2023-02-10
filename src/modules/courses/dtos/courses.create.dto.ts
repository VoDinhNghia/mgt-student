import { ApiProperty } from '@nestjs/swagger';
export class CourseCreateDto {
  @ApiProperty()
  name: string;
}
