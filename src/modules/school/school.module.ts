import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import { SchoolInfo, SchoolSchema } from './schemas/school.schema';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolInfo.name, schema: SchoolSchema },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService, ValidateField],
})
export class SchoolModule {}
