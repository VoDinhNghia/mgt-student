import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseCreateDto } from './dtos/courses.create.dto';
import { Course, CourseDocument } from './schemas/courses.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
  ) {}

  async createCourse(courseCreateDto: CourseCreateDto): Promise<Course> {
    const result = await new this.courseSchema(courseCreateDto).save();
    return result;
  }
}
