import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';
import { Semester, SemesterDocument } from './schemas/semesters.schema';

@Injectable()
export class SemestersService {
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  async createSemester(semesterDto: CreateSemesterDto): Promise<Semester> {
    const result = await new this.semesterSchema(semesterDto).save();
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
  ): Promise<Semester> {
    await this.semesterSchema.findByIdAndUpdate(id, updateDto);
    const result = this.findSemesterById(id);
    return result;
  }

  async findAllSemesters(): Promise<Semester[]> {
    const results = await this.semesterSchema.find({});
    return results;
  }

  async deleteSemester(id: string): Promise<void> {
    await this.findSemesterById(id);
    await this.semesterSchema.findByIdAndDelete(id);
  }
}
