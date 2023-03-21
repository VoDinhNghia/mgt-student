import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import {
  considerConditionScholarshipPoint,
  EstatusUserProfile,
  trainningPointDefault,
} from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Pagination } from 'src/utils/page.pagination';
import { QueryService } from 'src/utils/query.service';
import { SubjectUserRegister } from 'src/utils/user.register-subject.query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateScholarshipUser } from './dtos/scholarship-user.create.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { QueryScholarshipDto } from './dtos/scholarship.query.dto';
import { UpdateScholarshipDto } from './dtos/scholarship.update.dto';
import { QueryUserScholarshipDto } from './dtos/scholarship.user.query.dto';
import {
  Scholarship,
  ScholarshipDocument,
} from './schemas/scholarships.schema';
import {
  Scholarship_User,
  ScholarshipUserDocument,
} from './schemas/scholarships.user.schema';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
    @InjectModel(Scholarship_User.name)
    private readonly scholarshipUserSchema: Model<ScholarshipUserDocument>,
  ) {}

  async validateScholarShipDto(
    scholarshipDto: CreateScholarshipDto,
  ): Promise<void> {
    const { semester, name } = scholarshipDto;
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
    }
    if (name) {
      const options = {
        semester: new Types.ObjectId(semester),
        name: name.trim(),
      };
      await validate.existedByOptions(
        collections.scholarships,
        options,
        'Scholarship',
      );
    }
  }

  async createScholarship(
    scholarshipDto: CreateScholarshipDto,
    createdBy: string,
  ): Promise<Scholarship> {
    await this.validateScholarShipDto(scholarshipDto);
    const dto = {
      ...scholarshipDto,
      createdBy,
    };
    const result = await new this.scholarshipSchema(dto).save();
    return result;
  }

  async updateScholarship(
    id: string,
    scholarshipDto: UpdateScholarshipDto,
    updatedBy: string,
  ): Promise<Scholarship> {
    await this.validateScholarShipDto(scholarshipDto);
    const dto = {
      ...scholarshipDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.scholarshipSchema.findByIdAndUpdate(id, dto);
    const result = await this.findScholarshipById(id);
    return result;
  }

  async findScholarshipById(id: string): Promise<Scholarship> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupSemesterScholarship();
    const aggregate = [match, ...lookup];
    const results = await this.scholarshipSchema.aggregate(aggregate);
    if (!results[0]) {
      new CommonException(404, 'Scholarship not found.');
    }
    return results[0];
  }

  async findAllScholarship(
    queryDto: QueryScholarshipDto,
  ): Promise<Scholarship[]> {
    const { semester, type, limit, page, searchKey } = queryDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
    if (semester) {
      match.$match.semester = new Types.ObjectId(semester);
    }
    if (type) {
      match.$match.type = type.trim();
    }
    if (searchKey) {
      match.$match.$or = [{ name: new RegExp(searchKey) }];
    }
    const lookup = this.lookupSemesterScholarship();
    const agg = [match, ...lookup];
    const aggregate: any = new Pagination(limit, page, agg);
    const results = await this.scholarshipSchema.aggregate(aggregate);
    return results;
  }

  async findAllUserScholarShip(
    queryDto: QueryUserScholarshipDto,
  ): Promise<Record<string, any>[]> {
    const { scholarship, user, semester } = queryDto;
    let aggregate = [];
    const matchOne: Record<string, any> = { $match: { isDeleted: false } };
    if (scholarship) {
      matchOne.$match.scholarship = new Types.ObjectId(scholarship);
    }
    if (user) {
      matchOne.$match.user = new Types.ObjectId(user);
    }
    const lookup: any = new LookupCommon([
      {
        from: collections.scholarships,
        localField: 'scholarship',
        foreignField: '_id',
        as: 'scholarship',
        unwind: true,
      },
      {
        from: collections.profiles,
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        unwind: true,
      },
    ]);
    aggregate = [...aggregate, matchOne, ...lookup];
    if (semester) {
      aggregate = [
        ...aggregate,
        {
          $match: { 'scholarship.semester': new Types.ObjectId(semester) },
        },
      ];
    }
    const results = await this.scholarshipUserSchema.aggregate(aggregate);
    for (const item of results) {
      const tuition = await this.getUserPaymentStudyFee(
        item?.scholarship?.semester,
        item?.user?._id,
      );
      const rewardMoney =
        ((tuition?.totalMoney || 0) *
          (item?.scholarship?.percentTuition || 0)) /
        100;
      item.rewardMoney = rewardMoney;
    }
    return results;
  }

  async getUserPaymentStudyFee(
    semester: string,
    profile: string,
  ): Promise<Record<string, any>> {
    const options = {
      semester: new Types.ObjectId(semester),
      user: new Types.ObjectId(profile),
    };
    const result = await new QueryService().findOneByOptions(
      collections.payment_study_fees,
      options,
    );
    return result;
  }

  async createUserScholarshipInSemester(
    semester: string,
    createdBy: string,
  ): Promise<Record<string, any>[]> {
    const queryService = new QueryService();
    const optionFindOne = { _id: new Types.ObjectId(semester) };
    const semesterInfo = await queryService.findOneByOptions(
      collections.semesters,
      optionFindOne,
    );
    if (!semesterInfo) {
      new CommonException(404, 'Semester not found.');
    }
    const optionFind = { status: EstatusUserProfile.STUDYING };
    const studyProcessLists = await queryService.findByOptions(
      collections.study_processes,
      optionFind,
    );
    const data = [];
    for (const item of studyProcessLists) {
      try {
        const { totalAccumalated, totalNumberCredits } =
          await this.getUserTotalAccumalated(semester, item.user);
        const accumalatedPoint =
          totalNumberCredits > 0 ? totalAccumalated / totalNumberCredits : 0;
        const tranningpoint = await this.getUserTrainningPoint(
          item.user,
          semester,
        );
        if (accumalatedPoint < considerConditionScholarshipPoint) {
          continue;
        }
        const getCondition = await this.considerConditions(
          accumalatedPoint,
          tranningpoint,
          totalNumberCredits,
          semester,
        );
        if (!getCondition) {
          continue;
        }
        const userscholarshipDto: CreateScholarshipUser & {
          createdBy: string;
        } = {
          scholarship: getCondition._id,
          user: item.user,
          accumalatedPoint: accumalatedPoint,
          trainningPoint: tranningpoint,
          createdBy,
        };
        const existed = await this.scholarshipUserSchema.findOne({
          scholarship: getCondition._id,
          user: item.user,
        });
        if (existed) {
          continue;
        }
        data.push(
          await new this.scholarshipUserSchema(userscholarshipDto).save(),
        );
      } catch (error) {
        // console.log(error);
        continue;
      }
    }
    return data;
  }

  async considerConditions(
    accumalatedPoint: number,
    tranningpoint: number,
    numberCredit: number,
    semester: string,
  ): Promise<Record<string, any>> {
    const result = await this.scholarshipSchema.findOne({
      semester: new Types.ObjectId(semester),
      minimunPoints: { $lt: accumalatedPoint },
      maximunPoints: { $gt: accumalatedPoint },
      trainningPoints: { $lt: tranningpoint },
      numberCredit: { $lt: numberCredit },
      isDeleted: false,
    });
    return result;
  }

  async getUserTotalAccumalated(
    semester: string,
    profileId: string,
  ): Promise<{ totalAccumalated: number; totalNumberCredits: number }> {
    const service = new SubjectUserRegister();
    const subjectIds = await service.getSubjectIds(semester);
    const result = await service.getUserSubjects(profileId, subjectIds);
    let totalAccumalated = 0;
    let totalNumberCredits = 0;
    if (result.length <= 0) {
      return { totalAccumalated, totalNumberCredits };
    }
    for (const item of result) {
      if (item.subject?.calculateCumulativePoint) {
        totalAccumalated +=
          (item?.accumalatedPoint || 0) * item?.subject?.numberCredits;
        totalNumberCredits += item?.subject?.numberCredits || 0;
      }
    }
    return { totalAccumalated, totalNumberCredits };
  }

  async getUserTrainningPoint(
    profileId: string,
    semesterId: string,
  ): Promise<number> {
    const lookup: any = new LookupCommon([
      {
        from: collections.voluntee_programs,
        localField: 'program',
        foreignField: '_id',
        as: 'program',
        unwind: true,
      },
    ]);
    const aggregate = [
      {
        $match: {
          user: new Types.ObjectId(profileId),
          semester: new Types.ObjectId(semesterId),
          status: true,
        },
      },
      ...lookup,
    ];
    const results = await new QueryService().findByAggregate(
      collections.trainning_points,
      aggregate,
    );
    const totalTrainningPoint = results.reduce(
      (x: any, y: any) => (x.program?.point ?? 0) + (y.program?.point ?? 0),
      0,
    );
    const point = totalTrainningPoint + trainningPointDefault;
    return point > 100 ? 100 : point;
  }

  private lookupSemesterScholarship() {
    const lookup: any = new LookupCommon([
      {
        from: collections.semesters,
        localField: 'semester',
        foreignField: '_id',
        as: 'semester',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
