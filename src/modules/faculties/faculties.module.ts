import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Branch, BranchSchema } from '../branch/schemas/branch.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Faculty, FacultySchema } from './schemas/faculties.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService, ValidateField],
})
export class FacultiesModule {}
