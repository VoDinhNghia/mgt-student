import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scholarship, ScholarshipSchema } from './schemas/scholarships.schema';
import {
  Scholarship_User,
  ScholarshipUserSchema,
} from './schemas/scholarships.user.schema';
import { ScholarshipController } from './scholarships.controller';
import { ScholarshipService } from './scholarships.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Scholarship.name,
        schema: ScholarshipSchema,
      },
      {
        name: Scholarship_User.name,
        schema: ScholarshipUserSchema,
      },
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
})
export class ScholarshipModule {}
