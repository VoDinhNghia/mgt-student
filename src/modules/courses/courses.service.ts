import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { Course, CourseDocument } from './schemas/courses.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
  ) {}

  async createCourse(
    courseDto: CreateCourseDto,
    createdBy: string,
  ): Promise<Course> {
    await new ValidateDto().courseName(courseDto);
    const course = await new this.courseSchema({
      ...courseDto,
      createdBy,
    }).save();
    return course;
  }

  async findCourseById(id: string): Promise<Course> {
    const result = await this.courseSchema.findById(id);
    if (!result) {
      new CommonException(404, msgNotFound);
    }
    return result;
  }

  async updateCourse(
    id: string,
    courseDto: UpdateCourseDto,
    updatedBy: string,
  ): Promise<Course> {
    await new ValidateDto().courseName(courseDto);
    const dto = {
      ...courseDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.courseSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllCourses(): Promise<Course[]> {
    const results = await this.courseSchema.find({ isDeleted: false });
    return results;
  }
}
