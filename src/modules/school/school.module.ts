import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { School_Info, SchoolSchema } from './schemas/school.schema';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School_Info.name, schema: SchoolSchema },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
