import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SettingLearningRate,
  SettingLearningRateDocument,
} from './schemas/settings.learning-rating.schema';
import {
  SettingSubjectPass,
  SettingSubjectPassDocument,
} from './schemas/settings.subject-pass.schema';
import { Model } from 'mongoose';
import { CreateSettingSubjectPassDto } from './dtos/settings.create.subject-pass.dto';
import { UpdateSettingSubjectPassDto } from './dtos/settings.update.subject-pass.dto';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { settingMsg } from 'src/constants/constants.message.response';
import { QuerySettingSubjectPassDto } from './dtos/settings.query-subject-pass.dto';
import { IquerySettings } from './interfaces/settings.interface';
import { CreateSettingLearningRateDto } from './dtos/settings.create.learning-rate.dto';
import { UpdateSettingLearningRateDto } from './dtos/settings.update.learning-rate.dto';
import { QuerySettingLearningRateDto } from './dtos/settings.query-learning-rate.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SettingLearningRate.name)
    private readonly learningRateSchema: Model<SettingLearningRateDocument>,
    @InjectModel(SettingSubjectPass.name)
    private readonly subjectPassSchema: Model<SettingSubjectPassDocument>,
  ) {}

  async createSettingSubjectPass(
    settingDto: CreateSettingSubjectPassDto,
    createdBy: string,
  ): Promise<SettingSubjectPass> {
    const result = await new this.subjectPassSchema({
      ...settingDto,
      createdBy,
    }).save();
    return result;
  }

  async updateSettingSubjectPass(
    id: string,
    settingDto: UpdateSettingSubjectPassDto,
    updatedBy: string,
  ): Promise<SettingSubjectPass> {
    const updateDto = {
      ...settingDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.subjectPassSchema.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );
    return result;
  }

  async findSettingSubjectPassById(id: string): Promise<SettingSubjectPass> {
    const result = await this.subjectPassSchema.findById(id);
    if (!result) {
      new CommonException(404, settingMsg.notFoundSubjectPass);
    }
    return result;
  }

  async findAllSettingSubjectPass(
    queryDto: QuerySettingSubjectPassDto,
  ): Promise<{ results: SettingSubjectPass[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IquerySettings = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.subjectPassSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.subjectPassSchema.find(query).count();
    return { results, total };
  }

  async deleteSettingSubjectPass(id: string, deletedBy: string): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.subjectPassSchema.findByIdAndUpdate(id, deleteDto);
  }

  async createSettingLearningRate(
    settingDto: CreateSettingLearningRateDto,
    createdBy: string,
  ): Promise<SettingLearningRate> {
    const result = await new this.learningRateSchema({
      ...settingDto,
      createdBy,
    }).save();
    return result;
  }

  async updateSettingLearningRate(
    id: string,
    settingDto: UpdateSettingLearningRateDto,
    updatedBy: string,
  ): Promise<SettingLearningRate> {
    const updateDto = {
      ...settingDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.learningRateSchema.findByIdAndUpdate(
      id,
      updateDto,
      {
        new: true,
      },
    );
    return result;
  }

  async findSettingLearningRateById(id: string): Promise<SettingLearningRate> {
    const result = await this.learningRateSchema.findById(id);
    if (!result) {
      new CommonException(404, settingMsg.notFoundLearningRate);
    }
    return result;
  }

  async findAllSettingLearningRate(
    queryDto: QuerySettingLearningRateDto,
  ): Promise<{ results: SettingLearningRate[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IquerySettings = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.learningRateSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.learningRateSchema.find(query).count();
    return { results, total };
  }

  async deleteSettingLearningRate(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.learningRateSchema.findByIdAndUpdate(id, deleteDto);
  }
}
