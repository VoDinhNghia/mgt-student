import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Faculty, FacultySchema } from './schemas/faculties.schema';
import { Majors, MajorSchema } from './schemas/faculties.major.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Majors.name, schema: MajorSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
