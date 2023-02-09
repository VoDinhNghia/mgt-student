import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Faculty, FacultySchema } from './schemas/faculties.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
