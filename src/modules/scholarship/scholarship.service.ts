import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { trainningPointDefault } from 'src/constants/constant';
import { DbConnection } from 'src/constants/dbConnection';
import { CommonException } from 'src/exceptions/execeptionError';
import { Pagination } from 'src/utils/pagePagination';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { CreateScholarshipUser } from './dtos/scholarship-user.create.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { QueryScholarshipDto } from './dtos/scholarship.query.dto';
import { UpdateScholarshipDto } from './dtos/scholarship.update.dto';
import { Scholarship, ScholarshipDocument } from './schemas/scholarship.schema';
import {
  ScholarshipUser,
  ScholarshipUserDocument,
} from './schemas/scholarship.user.schema';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
    @InjectModel(ScholarshipUser.name)
    private readonly scholarshipUserSchema: Model<ScholarshipUserDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    private readonly db: DbConnection,
  ) {}

  // create function to calculate total student's final grade
  // => compare with condition in scholarshipsettings collection
  // => create document in userscholarships (create multi document)
  // export list scholarship => file excel

  async validateScholarShip(
    scholarshipDto: CreateScholarshipDto,
  ): Promise<void> {
    const { semester, name } = scholarshipDto;
    if (semester) {
      const semesterInfo = await this.semesterSchema.findById(semester);
      if (!semesterInfo) {
        new CommonException(404, 'Semester not found.');
      }
    }
    if (name) {
      const scholarship = await this.scholarshipSchema.findOne({
        semester: new Types.ObjectId(semester),
        name: name.trim(),
      });
      if (scholarship) {
        new CommonException(409, 'Scholarship name existed already.');
      }
    }
  }

  async createScholarship(
    scholarshipDto: CreateScholarshipDto,
  ): Promise<Scholarship> {
    await this.validateScholarShip(scholarshipDto);
    const result = await new this.scholarshipSchema(scholarshipDto).save();
    return result;
  }

  async updateScholarship(
    id: string,
    scholarshipDto: UpdateScholarshipDto,
  ): Promise<Scholarship> {
    await this.validateScholarShip(scholarshipDto);
    await this.scholarshipSchema.findByIdAndUpdate(id, scholarshipDto);
    const result = await this.findScholarshipById(id);
    return result;
  }

  async findScholarshipById(id: string): Promise<Scholarship> {
    const result = await this.scholarshipSchema
      .findById(id)
      .populate('semester', '', this.semesterSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Scholarship not found.');
    }
    return result;
  }

  async findAllScholarship(
    queryDto: QueryScholarshipDto,
  ): Promise<Scholarship[]> {
    const { semester, type, limit, page, searchKey } = queryDto;
    const match: Record<string, any> = { $match: {} };
    if (semester) {
      match.$match.semester = new Types.ObjectId(semester);
    }
    if (type) {
      match.$match.type = type.trim();
    }
    if (searchKey) {
      match.$match.$or = [{ name: new RegExp(searchKey) }];
    }
    const agg = [
      match,
      {
        $lookup: {
          from: 'semesters',
          localField: 'semester',
          foreignField: '_id',
          as: 'semester',
        },
      },
      { $unwind: '$semester' },
    ];
    const aggregate: any = new Pagination(limit, page, agg);
    const results = await this.scholarshipSchema.aggregate(aggregate);
    return results;
  }

  async createScholarshipUser(
    scholarshipUserDto: CreateScholarshipUser,
  ): Promise<ScholarshipUser> {
    await this.validateScholarshipUser(scholarshipUserDto);
    const result = await new this.scholarshipUserSchema(
      scholarshipUserDto,
    ).save();
    return result;
  }

  async validateScholarshipUser(
    scholarshipUserDto: CreateScholarshipUser,
  ): Promise<void> {
    const { user, scholarship } = scholarshipUserDto;
    if (user) {
      const profile = await this.db
        .collection('profiles')
        .findOne({ _id: new Types.ObjectId(user) });
      if (!profile) {
        new CommonException(404, 'User not found.');
      }
    }
    if (scholarship) {
      const scholarshipInfo = await this.scholarshipSchema.findById(
        scholarship,
      );
      if (!scholarshipInfo) {
        new CommonException(404, 'Scholarship not found.');
      }
    }
  }

  async getAccumalatedUser(semester: string): Promise<Record<string, any>[]> {
    const subjectIds = await this.getSubjectIds(semester);
    const match = { $match: { subject: { $in: subjectIds } } };
    const aggregate = [
      match,
      {
        $lookup: {
          from: 'studyprocesses',
          localField: 'studyprocess',
          foreignField: '_id',
          as: 'studyprocess',
        },
      },
      { $unwind: '$studyprocess' },
      {
        $lookup: {
          from: 'profiles',
          localField: 'studyprocess.user',
          foreignField: '_id',
          as: 'userProfile',
        },
      },
      { $unwind: '$userProfile' },
    ];
    const cursorAgg = await this.db
      .collection('subjectregisters')
      .aggregate(aggregate);
    const result = await cursorAgg.toArray();
    return result;
  }

  async getSubjectIds(semester: string): Promise<ObjectId[]> {
    const subjectList = await this.db
      .collection('subjects')
      .find({ semester: new Types.ObjectId(semester), status: true });
    const subjectIds = subjectList.map((subject) => {
      return subject._id;
    });
    return subjectIds;
  }

  async getTrainningPointUser(
    profileId: string,
    semesterId: string,
  ): Promise<number> {
    const cursorAgg = await this.db.collection('tranningpoints').aggregate([
      {
        $match: {
          user: new Types.ObjectId(profileId),
          semester: new Types.ObjectId(semesterId),
          status: true,
        },
      },
      {
        $lookup: {
          from: 'volunteeprograms',
          localField: 'program',
          foreignField: '_id',
          as: 'program',
        },
      },
      { $unwind: '$program' },
    ]);
    const result = await cursorAgg?.toArray();
    const totalTrainningPoint = result.reduce(
      (x: any, y: any) => (x.program?.point ?? 0) + (y.program?.point ?? 0),
      0,
    );
    return totalTrainningPoint + trainningPointDefault;
  }
}
