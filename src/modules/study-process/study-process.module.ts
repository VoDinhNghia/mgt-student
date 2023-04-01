import { Module } from '@nestjs/common';
import { StudyProcessController } from './study-process.controller';
import { StudyProcessService } from './study-process.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudyProcessSchema,
  StudyProcesses,
} from './schemas/study-process.schema';
import {
  DegreeManagement,
  DegreeManagementSchema,
} from './schemas/study-process.degree.schema';
import {
  SubjectRegisterSchema,
  SubjectRegisters,
} from './schemas/study-process.subject.schema';
import {
  SubjectAttendance,
  SubjectAttendanceSchema,
} from './schemas/study-process.attendance.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import {
  SubjectSchema,
  Subjects,
} from '../class-subject/schemas/class-subject.subject.schema';
import {
  SettingSubjectPass,
  SettingSubjectPassSchema,
} from '../settings/schemas/settings.subject-pass.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyProcesses.name, schema: StudyProcessSchema },
      { name: DegreeManagement.name, schema: DegreeManagementSchema },
      { name: SubjectRegisters.name, schema: SubjectRegisterSchema },
      { name: SubjectAttendance.name, schema: SubjectAttendanceSchema },
      { name: Subjects.name, schema: SubjectSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: SettingSubjectPass.name, schema: SettingSubjectPassSchema },
    ]),
  ],
  controllers: [StudyProcessController],
  providers: [StudyProcessService],
})
export class StudyProcessModule {}
