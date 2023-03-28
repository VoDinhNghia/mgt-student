import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { schoolId } from 'src/constants/constant';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolInfo, SchoolInfoDocument } from './schemas/school.schema';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { collections } from 'src/constants/constants.collections.name';
import { schoolMsg } from 'src/constants/constants.message.response';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { selectAttachment } from 'src/utils/utils.populate';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(SchoolInfo.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
  ) {}

  async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.schoolSchema.findOne({ schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
  }

  async findSchoolInfo(): Promise<SchoolInfo> {
    const results = await this.schoolSchema
      .findOne({ schoolId })
      .populate('image', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .populate('award', '', this.awardSchema, { isDeleted: false })
      .exec();
    if (!results) {
      new CommonException(404, schoolMsg.notFound);
    }
    return results;
  }

  async updateSchool(
    id: string,
    schoolDto: UpdateSchoolDto,
    updatedBy: string,
  ): Promise<SchoolInfo> {
    const { image = [], award = [] } = schoolDto;
    const validate = new ValidateDto();
    if (image.length > 0) {
      const imageIds = await new ValidateDto().idLists(
        collections.attachments,
        image,
      );
      schoolDto.image = imageIds;
    }
    if (award.length > 0) {
      const awardIds = await validate.idLists(collections.awards, award);
      schoolDto.award = awardIds;
    }
    await validate.school(schoolDto);
    const dto = {
      ...schoolDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.schoolSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }
}
