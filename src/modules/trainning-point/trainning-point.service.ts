import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TrainningPoints,
  TranningPointsDocument,
} from './schemas/trainning-point.schema';
import { Model } from 'mongoose';
import {
  VolunteePrograms,
  VolunteeProgramsDocument,
} from './schemas/trainning-point.voluntee-program.schema';

@Injectable()
export class TrainningPointService {
  constructor(
    @InjectModel(TrainningPoints.name)
    private readonly trainningPointSchema: Model<TranningPointsDocument>,
    @InjectModel(VolunteePrograms.name)
    private readonly volunteeProgramSchema: Model<VolunteeProgramsDocument>,
  ) {}
}
