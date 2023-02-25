import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scholarship, ScholarshipDocument } from './schemas/scholarship.schema';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
  ) {}

  // create function to calculate total student's final grade
  // => compare with condition in scholarshipsettings collection
  // => create document in userscholarships (create multi document)
}
