import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubjectRegisterDocument,
  SubjectRegisters,
} from './schemas/study-process.subject.schema';
import { Model, Types } from 'mongoose';
import {
  StudyProcessDocument,
  StudyProcesses,
} from './schemas/study-process.schema';
import {
  DegreeManagement,
  DegreeManagementDocument,
} from './schemas/study-process.degree.schema';
import {
  SubjectAttendance,
  SubjectAttendanceDocument,
} from './schemas/study-process.attendance.schema';
import {
  Subjects,
  SubjectDocument,
} from '../class-subject/schemas/class-subject.subject.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { UpdateStudyProcessDto } from './dtos/study-process.update.dto';
import { CreateStudySubjectProcessDto } from './dtos/study-process.create.subject-register.dto';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  classMsg,
  settingMsg,
  studyProcessMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { UpdatePointSubjectRegisterDto } from './dtos/study-process.update-point.subject.dto';
import { subjectLookup } from 'src/utils/utils.lookup.query.service';
import {
  SettingSubjectPass,
  SettingSubjectPassDocument,
} from '../settings/schemas/settings.subject-pass.schema';
import {
  EtypeSettingSubjectPass,
  EtypeStatusSubjectStudy,
} from 'src/constants/constant';
import { IupdateSubjectRegister } from './interfaces/study-process.interface';

@Injectable()
export class StudyProcessService {
  constructor(
    @InjectModel(SubjectRegisters.name)
    private readonly subjectRegisterSchema: Model<SubjectRegisterDocument>,
    @InjectModel(StudyProcesses.name)
    private readonly studyProcessSchema: Model<StudyProcessDocument>,
    @InjectModel(DegreeManagement.name)
    private readonly degreeManagementSchema: Model<DegreeManagementDocument>,
    @InjectModel(SubjectAttendance.name)
    private readonly subjectAttendanceSchema: Model<SubjectAttendanceDocument>,
    @InjectModel(Subjects.name)
    private readonly subjectSchema: Model<SubjectDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(SettingSubjectPass.name)
    private readonly settingSubjectSchema: Model<SettingSubjectPassDocument>,
  ) {}

  async updateStudyProcess(
    id: string,
    updateDto: UpdateStudyProcessDto,
    updatedBy: string,
  ): Promise<StudyProcesses> {
    const newDto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.studyProcessSchema.findByIdAndUpdate(id, newDto, {
      new: true,
    });
    return result;
  }

  async createSubjectRegister(
    createDto: CreateStudySubjectProcessDto,
    createdBy: string,
  ): Promise<SubjectRegisters> {
    const { subject, studyprocess } = createDto;
    const valid = new ValidFields();
    await valid.id(
      this.studyProcessSchema,
      studyprocess,
      studyProcessMsg.notFound,
    );
    await this.validNumberSubjectRegister(subject);
    const existed = await this.subjectRegisterSchema.findOne({
      subject: new Types.ObjectId(subject),
      studyprocess: new Types.ObjectId(studyprocess),
    });
    if (existed) {
      new CommonException(409, studyProcessMsg.existedSubjectRegister);
    }
    const result = await new this.subjectRegisterSchema({
      ...createDto,
      createdBy,
    }).save();
    return result;
  }

  async updatePointSubjectRegister(
    id: string,
    pointDto: UpdatePointSubjectRegisterDto,
    updatedBy: string,
  ): Promise<SubjectRegisters> {
    const { finalScore, midtermScore, essayScore } = pointDto;
    const accumalatedType = EtypeSettingSubjectPass.ACCUMULATED_POINT;
    const finalPointType = EtypeSettingSubjectPass.FINAL_EXAM_POINT;
    const typePass = EtypeStatusSubjectStudy.PASS;
    const typeFailed = EtypeStatusSubjectStudy.FAILED;
    const subjectRegister = await this.subjectRegisterSchema.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    });
    if (!subjectRegister) {
      new CommonException(404, studyProcessMsg.notFoundSubjectRegister);
    }
    if (subjectRegister.accumalatedPoint && subjectRegister.status) {
      new CommonException(403, studyProcessMsg.notPermissionUpdateSubject);
    }
    const updateDto: IupdateSubjectRegister = {
      ...pointDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    if (finalScore) {
      const settingAccumlated = await this.findSettingSubject(accumalatedType);
      const settingFinalPoint = await this.findSettingSubject(finalPointType);
      if (finalScore < settingFinalPoint) {
        updateDto.status = typeFailed;
        updateDto.accumalatedPoint = finalScore;
      } else {
        const midPoint = midtermScore || subjectRegister.midtermScore || 0;
        const essayPoint = essayScore || subjectRegister.essayScore || 0;
        const accumalatedPoint = await this.calculateAccumulatedPoint(
          subjectRegister.subject,
          midPoint,
          finalScore,
          essayPoint,
        );
        updateDto.accumalatedPoint = accumalatedPoint;
        const isPass = accumalatedPoint >= settingAccumlated;
        updateDto.status = isPass ? typePass : typeFailed;
      }
    }
    const result = await this.subjectRegisterSchema.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );
    return result;
  }

  async findSettingSubject(type: string): Promise<number> {
    const result = await this.settingSubjectSchema.findOne({
      type,
      isDeleted: false,
    });
    if (!result) {
      new CommonException(404, settingMsg.notFoundSubjectPass);
    }
    return result.condition;
  }

  async calculateAccumulatedPoint(
    subjectId: string | Types.ObjectId,
    midtermScore: number,
    finalScore: number,
    essayScore: number,
  ): Promise<number> {
    const lookup = subjectLookup();
    const subject = await this.subjectSchema.aggregate([
      { $match: { _id: subjectId, isDeleted: false } },
      ...lookup,
    ]);
    if (!subject[0]) {
      new CommonException(404, classMsg.notFoundSubject);
    }
    const { midTermTest, finalExam, studentEssay } = subject[0].process;
    const pointMid = (midTermTest.percent * midtermScore) / 100;
    const pointEsasy = (studentEssay.percent * essayScore) / 100;
    const pointFinal = (finalExam.percent * finalScore) / 100;
    const accumalatedPoint = pointEsasy + pointFinal + pointMid;
    return accumalatedPoint;
  }

  async validNumberSubjectRegister(subject: string): Promise<void> {
    const subjectInfo = await this.subjectSchema.findOne({
      _id: new Types.ObjectId(subject),
      isDeleted: false,
    });
    if (!subjectInfo) {
      new CommonException(404, classMsg.notFoundSubject);
    }
    const getAllRegister = await this.subjectRegisterSchema.find({
      subject: new Types.ObjectId(subject),
    });
    if (subjectInfo.size <= getAllRegister.length) {
      new CommonException(409, studyProcessMsg.sufficientNumber);
    }
  }
}
