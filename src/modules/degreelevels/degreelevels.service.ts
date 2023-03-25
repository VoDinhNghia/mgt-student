import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateDegreeLevelDto } from './dtos/degreelevels.create.dto';
import { UpdateDegreeLevelDto } from './dtos/degreeLevels.update.dto';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from './schemas/degreelevels.schema';

@Injectable()
export class DegreelevelService {
  constructor(
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
  ) {}

  async createDegreeLevel(
    degreelevelDto: CreateDegreeLevelDto,
    createdBy: string,
  ): Promise<DegreeLevel> {
    await new ValidateDto().degreeLevelName(degreelevelDto);
    const result = await new this.degreeLevelSchema({
      ...degreelevelDto,
      createdBy,
    }).save();
    return result;
  }

  async findDegreeLevelById(id: string): Promise<DegreeLevel> {
    const result = await this.degreeLevelSchema.findById(id);
    if (!result) {
      new CommonException(404, msgNotFound);
    }
    return result;
  }

  async updateDegreeLevel(
    id: string,
    updateDto: UpdateDegreeLevelDto,
    updatedBy: string,
  ): Promise<DegreeLevel> {
    await new ValidateDto().degreeLevelName(updateDto);
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.degreeLevelSchema.findByIdAndUpdate(id, dto);
    const result = await this.findDegreeLevelById(id);
    return result;
  }

  async findAllDegreeLevels(): Promise<DegreeLevel[]> {
    const results = await this.degreeLevelSchema.find({});
    return results;
  }
}
