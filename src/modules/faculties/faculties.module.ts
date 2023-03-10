import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Faculty, FacultySchema } from './schemas/faculties.schema';
import { Majors, MajorSchema } from './schemas/major.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Majors.name, schema: MajorSchema },
    ]),
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
