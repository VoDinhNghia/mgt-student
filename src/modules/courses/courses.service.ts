import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { Course, CourseDocument } from './schemas/courses.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
  ) {}

  async validateCourseName(courseDto: CreateCourseDto): Promise<void> {
    const { name } = courseDto;
    if (name) {
      const options = { name: name.trim() };
      await new ValidateDto().existedByOptions(
        'courses',
        options,
        'Course name',
      );
    }
  }

  async createCourse(
    courseDto: CreateCourseDto,
    createdBy: string,
  ): Promise<Course> {
    await this.validateCourseName(courseDto);
    const course = await new this.courseSchema({
      ...courseDto,
      createdBy,
    }).save();
    return course;
  }

  async findCourseById(id: string): Promise<Course> {
    const result = await this.courseSchema.findById(id);
    if (!result) {
      new CommonException(404, 'Course not found.');
    }
    return result;
  }

  async updateCourse(
    id: string,
    courseDto: UpdateCourseDto,
    updatedBy: string,
  ): Promise<Course> {
    await this.validateCourseName(courseDto);
    const dto = {
      ...courseDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.courseSchema.findByIdAndUpdate(id, dto);
    const result = await this.findCourseById(id);
    return result;
  }

  async findAllCourses(): Promise<Course[]> {
    const results = await this.courseSchema.find({ isDeleted: false });
    return results;
  }
}
