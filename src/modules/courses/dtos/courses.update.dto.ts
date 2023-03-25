import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './courses.create.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
