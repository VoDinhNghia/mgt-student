import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupService } from 'src/utils/lookup.query.service';
import { QueryPagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { QueryAwardDto } from './dtos/awards.query.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
import { ImatchFindAward } from './interfaces/awards.match.find';
import { Award, AwardDocument } from './schemas/awards.schema';

@Injectable()
export class AwardsService {
  constructor(
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
  ) {}

  async createAward(
    createAwardDto: CreateAwardDto,
    createdBy: string,
  ): Promise<Award> {
    const { attachment = [] } = createAwardDto;
    const attachmentIds = await new ValidateDto().idLists(
      collections.attachments,
      attachment,
    );
    createAwardDto.attachment = attachmentIds;
    const result = await new this.awardSchema({
      ...createAwardDto,
      createdBy,
    }).save();
    return result;
  }

  async findAwardById(id: string): Promise<Award> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = new LookupService().award();
    const aggregate = [match, ...lookup];
    const result = await this.awardSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async updateAward(
    id: string,
    updateAwardDto: UpdateAwardDto,
    updatedBy: string,
  ): Promise<Award> {
    await this.findAwardById(id);
    const dto = {
      ...updateAwardDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.awardSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async deleteAward(id: string): Promise<void> {
    await this.findAwardById(id);
    await this.awardSchema.findByIdAndDelete(id);
  }

  async findAllAward(
    queryAwardDto: QueryAwardDto,
  ): Promise<{ data: Award[]; countTotal: number }> {
    const { limit, page, searchKey, type, fromDate, toDate } = queryAwardDto;
    const match: ImatchFindAward = { $match: { isDeleted: false } };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey);
    }
    if (type) {
      match.$match.type = type;
    }
    if (fromDate && !toDate) {
      match.$match.time = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      match.$match.time = { $lte: toDate };
    }
    if (fromDate && !toDate) {
      match.$match.time = { $gte: fromDate, $lte: toDate };
    }
    const lookup = new LookupService().award();
    const aggregatePagi = new QueryPagination().skipLimitAndSort(limit, page);
    const aggregate = [match, ...aggregatePagi, ...lookup];
    const result = await this.awardSchema.aggregate(aggregate);
    const countDocument = await this.awardSchema.countDocuments();
    return {
      data: result,
      countTotal: countDocument,
    };
  }
}
