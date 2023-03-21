import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Pagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { QueryAwardDto } from './dtos/awards.query.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
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
      collectionNames.attachments,
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
    const lookup = this.lookupAward();
    const aggregate = [match, ...lookup];
    const result = await this.awardSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, `Award not found.`);
    }
    return result[0];
  }

  async updateAward(
    id: string,
    updateAwardDto: UpdateAwardDto,
    updatedBy: string,
  ): Promise<void> {
    await this.findAwardById(id);
    const dto = {
      ...updateAwardDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.awardSchema.findByIdAndUpdate(id, dto);
  }

  async deleteAward(id: string): Promise<void> {
    await this.findAwardById(id);
    await this.awardSchema.findByIdAndDelete(id);
  }

  async findAllAward(
    queryAwardDto: QueryAwardDto,
  ): Promise<{ data: Award[]; countTotal: number | any }> {
    const { limit, page, searchKey, type, fromDate, toDate } = queryAwardDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
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
      match.$match.time = { $lt: toDate };
    }
    if (fromDate && !toDate) {
      match.$match.time = { $gte: fromDate, $lt: toDate };
    }
    const lookup = this.lookupAward();
    const aggregatePagi: any = new Pagination(limit, page, [match]);
    const aggregate = [...aggregatePagi, ...lookup];
    const result = await this.awardSchema.aggregate(aggregate);
    const countDocument = await this.awardSchema.countDocuments();
    return {
      data: result,
      countTotal: countDocument,
    };
  }

  private lookupAward() {
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.attachments,
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
    ]);
    return lookup;
  }
}
