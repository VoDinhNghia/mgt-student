import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { courseMsg } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { QueryCourseDto } from './dtos/courses.query.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { IqueryCourse } from './interfaces/courses.interface';
import { Course, CourseDocument } from './schemas/courses.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
  ) {}

  public async createCourse(
    courseDto: CreateCourseDto,
    createdBy: string,
  ): Promise<Course> {
    const { name } = courseDto;
    await this.validateName(name);
    const course = await new this.courseSchema({
      ...courseDto,
      createdBy,
    }).save();

    return course;
  }

  public async findCourseById(id: string): Promise<Course> {
    const result = await this.courseSchema.findById(id);
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, courseMsg.notFound);
    }

    return result;
  }

  public async updateCourse(
    id: string,
    courseDto: UpdateCourseDto,
    updatedBy: string,
  ): Promise<Course> {
    const { name } = courseDto;
    if (name) {
      await this.validateName(name);
    }
    const updateDto = {
      ...courseDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.courseSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return result;
  }

  public async findAllCourses(
    queryDto: QueryCourseDto,
  ): Promise<{ results: Course[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryCourse = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.courseSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.courseSchema.find(query).count();

    return { results, total };
  }

  public async deleteCourse(id: string, deletedBy: string): Promise<void> {
    await this.findCourseById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.courseSchema.findByIdAndUpdate(id, deleteDto);
  }

  private async validateName(name: string): Promise<void> {
    const result = await this.courseSchema.findOne({
      name: name.trim(),
      isDeleted: false,
    });
    if (result) {
      new CommonException(HttpStatusCode.CONFLICT, courseMsg.existedName);
    }
  }
}
