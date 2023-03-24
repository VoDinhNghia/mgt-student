import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collections } from 'src/constants/collections.name';
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
  validate = new ValidateDto();
  constructor(
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
  ) {}

  async validateDegreeLevelName(
    degreeLevelDto: Record<string, any>,
  ): Promise<void> {
    const { name } = degreeLevelDto;
    if (name) {
      const options = { name: name.trim() };
      await this.validate.existedByOptions(
        collections.degreelevels,
        options,
        'DegreeLevel name',
      );
    }
  }

  async createDegreeLevel(
    degreelevelDto: CreateDegreeLevelDto,
    createdBy: string,
  ): Promise<DegreeLevel> {
    await this.validateDegreeLevelName(degreelevelDto);
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
    await this.validateDegreeLevelName(updateDto);
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
