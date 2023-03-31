import { Module } from '@nestjs/common';
import { TrainningPointController } from './trainning-point.controller';
import { TrainningPointService } from './trainning-point.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrainningPoints,
  TranningPointSchema,
} from './schemas/trainning-point.schema';
import {
  VolunteePrograms,
  VolunteeProgramsSchema,
} from './schemas/trainning-point.voluntee-program.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrainningPoints.name,
        schema: TranningPointSchema,
      },
      {
        name: VolunteePrograms.name,
        schema: VolunteeProgramsSchema,
      },
    ]),
  ],
  controllers: [TrainningPointController],
  providers: [TrainningPointService],
})
export class TrainningPointModule {}
