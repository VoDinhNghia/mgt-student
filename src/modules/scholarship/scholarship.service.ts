import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  EstatusUserProfile,
  trainningPointDefault,
} from 'src/constants/constant';
import { DbConnection } from 'src/constants/dbConnection';
import { CommonException } from 'src/exceptions/execeptionError';
import { Pagination } from 'src/utils/pagePagination';
import { SubjectUserRegister } from 'src/utils/subjectUserRegister';
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

  async createUserScholarshipInSemester(
    semester: string,
  ): Promise<Record<string, any>[]> {
    const semesterInfo = await this.db
      .collection('semesters')
      .findOne({ _id: new Types.ObjectId(semester) });
    if (!semesterInfo) {
      new CommonException(404, 'Semester not found.');
    }
    const cursorFind = await this.db
      .collection('studyprocesses')
      .find({ status: EstatusUserProfile.STUDYING });
    const studyProcessLists = await cursorFind.toArray();
    const data = [];
    for (const item of studyProcessLists) {
      try {
        const accumalatedPoint = await this.getTotalAccumalatedUserInSemester(
          semester,
          item.user,
        );
        const tranningpoint = await this.getTrainningPointUserInSemester(
          item.user,
          semester,
        );
        if (accumalatedPoint < 6.5) {
          continue;
        }
        const getCondition = await this.considerConditions(
          accumalatedPoint,
          tranningpoint,
          semester,
        );
        if (getCondition) {
          const userscholarshipDto: CreateScholarshipUser = {
            scholarship: getCondition._id,
            user: item.user,
            accumalatedPoint: accumalatedPoint,
            trainningPoint: tranningpoint,
          };
          const existed = await this.scholarshipUserSchema.findOne({
            scholarship: getCondition._id,
            user: item.user,
          });
          if (!existed) {
            data.push(
              await new this.scholarshipUserSchema(userscholarshipDto).save(),
            );
          }
        }
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return data;
  }

  async considerConditions(
    accumalatedPoint: number,
    tranningpoint: number,
    semester: string,
  ): Promise<Record<string, any>> {
    const result = await this.scholarshipSchema.findOne({
      semester: new Types.ObjectId(semester),
      minimunPoints: { $lt: accumalatedPoint },
      maximunPoints: { $gt: accumalatedPoint },
      trainningPoints: { $lt: tranningpoint },
    });
    return result;
  }

  async getTotalAccumalatedUserInSemester(
    semester: string,
    profileId: string,
  ): Promise<number> {
    const subjectService = new SubjectUserRegister(this.db);
    const subjectIds = await subjectService.getSubjectLists(semester);
    const result = await subjectService.getSubjectUserInSemester(
      profileId,
      subjectIds,
    );
    let totalAccumalated = 0;
    let totalNumberCredits = 0;
    if (result.length <= 0) {
      return 0;
    }
    for (const item of result) {
      totalAccumalated +=
        (item?.accumalatedPoint || 0) * item?.subject?.numberCredits;
      totalNumberCredits += item?.subject?.numberCredits || 0;
    }
    return totalAccumalated / totalNumberCredits;
  }

  async getTrainningPointUserInSemester(
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
    const point = totalTrainningPoint + trainningPointDefault;
    return point > 100 ? 100 : point;
  }
}
