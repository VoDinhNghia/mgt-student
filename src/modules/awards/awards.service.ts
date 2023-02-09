import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Award, AwardDocument } from './schemas/awards.schema';

@Injectable()
export class AwardsService {
  constructor(
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
  ) {}
}
