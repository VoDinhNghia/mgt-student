import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TrainningPoints,
  TranningPointsDocument,
} from './schemas/trainning-point.schema';
import { Model } from 'mongoose';
import {
  VolunteePrograms,
  VolunteeProgramsDocument,
} from './schemas/trainning-point.voluntee-program.schema';
import {
  Faculty,
  FacultyDocument,
} from '../faculties/schemas/faculties.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import {
  ItrainningPointImport,
  IvolunteeImport,
} from './interfaces/trainning-point.interface';
import {
  facultiesMsg,
  semesterMsg,
  trainningPointMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { EtypeVolunteeProgram } from 'src/constants/constant';

@Injectable()
export class TrainningPointService {
  constructor(
    @InjectModel(TrainningPoints.name)
    private readonly trainningPointSchema: Model<TranningPointsDocument>,
    @InjectModel(VolunteePrograms.name)
    private readonly volunteeProgramSchema: Model<VolunteeProgramsDocument>,
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  async importVoluntee(
    data: IvolunteeImport[],
    createdBy: string,
  ): Promise<IvolunteeImport[]> {
    const faculties = await this.facultySchema.find({ isDeleted: false });
    const semesters = await this.semesterSchema.find({ isDeleted: false });
    const userProfiles = await this.profileSchema.find({ isDeleted: false });
    for await (const item of data) {
      const {
        faculty,
        semester,
        type,
        leader,
        secretary,
        title,
        location,
        startDate,
        endDate,
      } = item;
      if (!title || !location || !startDate || !type || !endDate) {
        item.status = trainningPointMsg.validateVoluntee;
        continue;
      }
      try {
        item.startDate = new Date(startDate);
        item.endDate = new Date(endDate);
      } catch {
        item.status = trainningPointMsg.validateDate;
        continue;
      }
      if (faculty || EtypeVolunteeProgram.FACULTY) {
        const facultyInfo = faculties.find(
          (fac: FacultyDocument) => fac.name === faculty.trim(),
        );
        if (!facultyInfo) {
          item.status = facultiesMsg.notFound;
          continue;
        }
        item.faculty = facultyInfo._id;
      }
      const semesterInfo = semesters.find(
        (sem: SemesterDocument) => semester === sem.code,
      );
      if (!semesterInfo) {
        item.status = semesterMsg.notFound;
        continue;
      }
      item.semester = semesterInfo._id;
      const leaderInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === leader,
      );
      if (!leaderInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      const secretaryInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === secretary,
      );
      if (!secretaryInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      item.organizingCommittee = {
        leader: leaderInfo._id,
        secretary: secretaryInfo._id,
      };
      try {
        await new this.volunteeProgramSchema({ ...item, createdBy }).save();
        item.status = trainningPointMsg.statusImportVoluntee;
      } catch {
        item.status = trainningPointMsg.sysError;
        continue;
      }
    }
    return data;
  }

  async importTrainningPoint(
    data: ItrainningPointImport[],
    createdBy: string,
  ): Promise<ItrainningPointImport[]> {
    const voluntees = await this.volunteeProgramSchema.find({
      isDeleted: false,
    });
    const semesters = await this.semesterSchema.find({ isDeleted: false });
    const userProfiles = await this.profileSchema.find({ isDeleted: false });
    for await (const item of data) {
      const { user, semester, program } = item;
      const userInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === user,
      );
      if (!userInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      item.user = userInfo._id;
      const semesterInfo = semesters.find(
        (sem: SemesterDocument) => semester === sem.code,
      );
      if (!semesterInfo) {
        item.status = semesterMsg.notFound;
        continue;
      }
      item.semester = semesterInfo._id;
      const volunteeInfo = voluntees.find(
        (vol: VolunteeProgramsDocument) => vol.code === program,
      );
      if (!volunteeInfo) {
        item.status = trainningPointMsg.notFoundVoluntee;
        continue;
      }
      item.program = volunteeInfo._id;
      try {
        await new this.trainningPointSchema({ ...item, createdBy }).save();
        item.status = trainningPointMsg.statusImportTrainningPoint;
      } catch {
        item.status = trainningPointMsg.sysError;
        continue;
      }
    }
    return data;
  }
}
