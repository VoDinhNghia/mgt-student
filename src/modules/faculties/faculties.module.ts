import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Faculty, FacultySchema } from './schemas/faculties.schema';
import { Majors, MajorSchema } from './schemas/major.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Award.name, schema: AwardSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Majors.name, schema: MajorSchema },
    ]),
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService, ValidateField],
})
export class FacultiesModule {}
