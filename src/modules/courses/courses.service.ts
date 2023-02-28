import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import {
  Faculty,
  FacultyDocument,
} from '../faculties/schemas/faculties.schema';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { Course, CourseDocument } from './schemas/courses.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    private readonly validate: ValidateField,
  ) {}

  async validateCourse(courseDto: CreateCourseDto): Promise<void> {
    const { name } = courseDto;
    if (name) {
      await this.validate.existed(this.facultySchema, { name }, 'Course name');
    }
  }

  async createCourse(courseDto: CreateCourseDto): Promise<Course> {
    await this.validateCourse(courseDto);
    const course = await new this.courseSchema(courseDto).save();
    const result = await this.findCourseById(course._id);
    return result;
  }

  async findCourseById(id: string): Promise<Course> {
    const result = await this.courseSchema
      .findById(id)
      .populate('faculty', '', this.facultySchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Course not found.');
    }
    return result;
  }

  async updateCourse(id: string, courseDto: UpdateCourseDto): Promise<Course> {
    await this.validateCourse(courseDto);
    await this.courseSchema.findByIdAndUpdate(id, courseDto);
    const result = await this.findCourseById(id);
    return result;
  }

  async findAllCourses(): Promise<Course[]> {
    const results = await this.courseSchema
      .find({})
      .populate('faculty', '', this.facultySchema)
      .exec();
    return results;
  }
}
