import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { semesterMsg } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { QuerySemesterDto } from './dtos/semesters.query.dto';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';
import { IsemesterQuery } from './interfaces/semesters.find.interface';
import { Semester, SemesterDocument } from './schemas/semesters.schema';
import { getRandomCodeSemester } from 'src/utils/utils.generate.code';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class SemestersService {
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  public async createSemester(
    semesterDto: CreateSemesterDto,
    createdBy: string,
  ): Promise<Semester> {
    const dto = {
      ...semesterDto,
      code: getRandomCodeSemester(3),
      createdBy,
    };
    const result = await new this.semesterSchema(dto).save();

    return result;
  }

  public async findSemesterById(id: string): Promise<Semester> {
    const result = await this.semesterSchema.findById(id);
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, semesterMsg.notFound);
    }

    return result;
  }

  public async updateSemester(
    id: string,
    updateDto: UpdateSemesterDto,
    updatedBy: string,
  ): Promise<Semester> {
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.semesterSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });

    return result;
  }

  public async findAllSemesters(
    queryDto: QuerySemesterDto,
  ): Promise<{ results: Semester[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IsemesterQuery = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.semesterSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.semesterSchema.find(query).count();

    return {
      results,
      total,
    };
  }

  public async deleteSemester(id: string, deletedBy: string): Promise<void> {
    await this.findSemesterById(id);
    const dto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.semesterSchema.findByIdAndUpdate(id, dto);
  }
}
