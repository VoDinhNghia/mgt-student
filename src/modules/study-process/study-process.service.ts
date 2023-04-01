import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubjectRegisterDocument,
  SubjectRegisters,
} from './schemas/study-process.subject.schema';
import { Model } from 'mongoose';
import {
  StudyProcessDocument,
  StudyProcesses,
} from '../users/schemas/users.study-process.schema';
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
  ) {}
}
