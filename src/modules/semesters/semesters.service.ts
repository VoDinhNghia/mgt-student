import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';
import { Semester, SemesterDocument } from './schemas/semesters.schema';

@Injectable()
export class SemestersService {
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  async createSemester(
    semesterDto: CreateSemesterDto,
    createdBy: string,
  ): Promise<Semester> {
    const dto = {
      ...semesterDto,
      createdBy,
    };
    const result = await new this.semesterSchema(dto).save();
    return result;
  }

  async findSemesterById(id: string): Promise<Semester> {
    const result = await this.semesterSchema.findById(id);
    if (!result) {
      new CommonException(404, 'Semester not found.');
    }
    return result;
  }

  async updateSemester(
    id: string,
    updateDto: UpdateSemesterDto,
    updatedBy: string,
  ): Promise<Semester> {
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.semesterSchema.findByIdAndUpdate(id, dto);
    const result = this.findSemesterById(id);
    return result;
  }

  async findAllSemesters(): Promise<Semester[]> {
    const results = await this.semesterSchema.find({ isDeleted: false });
    return results;
  }

  async deleteSemester(id: string, deletedBy: string): Promise<void> {
    await this.findSemesterById(id);
    const dto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.semesterSchema.findByIdAndUpdate(id, dto);
  }
}
