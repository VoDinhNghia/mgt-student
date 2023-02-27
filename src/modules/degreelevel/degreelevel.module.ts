import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DegreelevelController } from './degreelevel.controller';
import { DegreelevelService } from './degreelevel.service';
import { DegreeLevel, DegreeLevelSchema } from './schemas/degreelevel.schema';

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
