import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Faculty, FacultySchema } from '../faculties/schemas/faculties.schema';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './schemas/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Faculty.name,
        schema: FacultySchema,
      },
    ]),
  ],
  providers: [CoursesService, ValidateField],
  controllers: [CoursesController],
})
export class CoursesModule {}
