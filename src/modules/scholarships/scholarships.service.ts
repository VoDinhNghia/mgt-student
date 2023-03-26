/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import {
  considerConditionScholarshipPoint,
  EstatusUserProfile,
  trainningPointDefault,
} from 'src/constants/constant';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { QueryService } from 'src/utils/query.service';
import { SubjectUserRegister } from 'src/utils/user.register-subject.query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateScholarshipUser } from './dtos/scholarship.user.create.dto';
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
import { ImatchFindAllScholarship } from './interfaces/scholarship.match.find-all';
import {
  semesterScholarshipLookup,
  trainningPointScholarshipLookup,
  userScholarshipLookup,
} from 'src/utils/lookup.query.service';
import { skipLimitAndSortPagination } from 'src/utils/page.pagination';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
    @InjectModel(Scholarship_User.name)
    private readonly scholarshipUserSchema: Model<ScholarshipUserDocument>,
  ) {}

  async createScholarship(
    scholarshipDto: CreateScholarshipDto,
    createdBy: string,
  ): Promise<Scholarship> {
    await new ValidateDto().scholarShip(scholarshipDto);
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
    await new ValidateDto().scholarShip(scholarshipDto);
    const dto = {
      ...scholarshipDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.scholarshipSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findScholarshipById(id: string): Promise<Scholarship> {
    const match: ImatchFindAllScholarship = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = semesterScholarshipLookup();
    const aggregate = [match, ...lookup];
    const results = await this.scholarshipSchema.aggregate(aggregate);
    if (!results[0]) {
      new CommonException(404, msgNotFound);
    }
    return results[0];
  }

  async findAllScholarship(
    queryDto: QueryScholarshipDto,
  ): Promise<Scholarship[]> {
    const { semester, type, limit, page, searchKey } = queryDto;
    const match: ImatchFindAllScholarship = { $match: { isDeleted: false } };
    if (semester) {
      match.$match.semester = new Types.ObjectId(semester);
    }
    if (type) {
      match.$match.type = type.trim();
    }
    if (searchKey) {
      match.$match.$or = [{ name: new RegExp(searchKey) }];
    }
    const lookup = semesterScholarshipLookup();
    const aggregate = skipLimitAndSortPagination(limit, page);
    const results = await this.scholarshipSchema.aggregate([
      match,
      ...aggregate,
      ...lookup,
    ]);
    return results;
  }

  async findAllUserScholarShip(
    queryDto: QueryUserScholarshipDto,
  ): Promise<Record<string, any>[]> {
    const { scholarship, user, semester } = queryDto;
    let aggregate = [];
    const matchOne: ImatchFindAllScholarship = { $match: { isDeleted: false } };
    if (scholarship) {
      matchOne.$match.scholarship = new Types.ObjectId(scholarship);
    }
    if (user) {
      matchOne.$match.user = new Types.ObjectId(user);
    }
    const lookup = userScholarshipLookup();
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
    for await (const item of results) {
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
    const queryService = new QueryService();
    const result = await queryService.findOneByOptions(
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
    for await (const item of studyProcessLists) {
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
  ): Promise<ScholarshipDocument> {
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
    const lookup = trainningPointScholarshipLookup();
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
    const queryService = new QueryService();
    const results = await queryService.findByAggregate(
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
}
