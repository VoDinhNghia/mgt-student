import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Center, CenterDocument } from './schemas/center.schema';

@Injectable()
export class CenterService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerSchema: Model<CenterDocument>,
  ) {}
}
