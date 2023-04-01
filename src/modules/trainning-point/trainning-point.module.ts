import { Module } from '@nestjs/common';
import { TrainningPointController } from './trainning-point.controller';
import { TrainningPointService } from './trainning-point.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrainningPoints,
  TranningPointSchema,
} from './schemas/trainning-point.schema';
import {
  VolunteePrograms,
  VolunteeProgramsSchema,
} from './schemas/trainning-point.voluntee-program.schema';
import { Faculty, FacultySchema } from '../faculties/schemas/faculties.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrainningPoints.name,
        schema: TranningPointSchema,
      },
      {
        name: VolunteePrograms.name,
        schema: VolunteeProgramsSchema,
      },
      {
        name: Faculty.name,
        schema: FacultySchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: Semester.name,
        schema: SemesterSchema,
      },
    ]),
  ],
  controllers: [TrainningPointController],
  providers: [TrainningPointService],
})
export class TrainningPointModule {}
