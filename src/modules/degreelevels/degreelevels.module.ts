import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DegreelevelController } from './degreelevels.controller';
import { DegreelevelService } from './degreelevels.service';
import { DegreeLevel, DegreeLevelSchema } from './schemas/degreelevels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DegreeLevel.name, schema: DegreeLevelSchema },
    ]),
  ],
  providers: [DegreelevelService],
  controllers: [DegreelevelController],
})
export class DegreelevelModule {}
