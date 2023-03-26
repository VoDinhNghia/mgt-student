import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scholarship, ScholarshipSchema } from './schemas/scholarships.schema';
import {
  ScholarshipUser,
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
        name: ScholarshipUser.name,
        schema: ScholarshipUserSchema,
      },
    ]),
  ],
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
})
export class ScholarshipModule {}
