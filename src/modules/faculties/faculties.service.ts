import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
  ) {}

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const result = await new this.facultySchema(createFacultyDto).save();
    return result;
  }
}
