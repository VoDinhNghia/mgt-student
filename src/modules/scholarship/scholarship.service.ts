import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { trainningPointDefault } from 'src/constants/constant';
import { DbConnection } from 'src/constants/dbConnection';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { Scholarship, ScholarshipDocument } from './schemas/scholarship.schema';
import {
  ScholarshipSettingDocument,
  ScholarshipSettings,
} from './schemas/scholarship.setting.schema';
import {
  ScholarshipUser,
  ScholarshipUserDocument,
} from './schemas/scholarship.user.schema';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
    @InjectModel(ScholarshipSettings.name)
    private readonly scholarshipSettingSchema: Model<ScholarshipSettingDocument>,
    @InjectModel(ScholarshipUser.name)
    private readonly scholarshipUserSchema: Model<ScholarshipUserDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    private readonly db: DbConnection,
  ) {}

  // create function to calculate total student's final grade
  // => compare with condition in scholarshipsettings collection
  // => create document in userscholarships (create multi document)
  // export list scholarship => file excel

  async getTrainningPointUser(
    profileId: string,
    semesterId: string,
  ): Promise<number> {
    const cursorAgg = await this.db.collection('tranningpoints').aggregate([
      {
        $match: {
          user: new Types.ObjectId(profileId),
          semester: new Types.ObjectId(semesterId),
          status: true,
        },
      },
      {
        $lookup: {
          from: 'volunteeprograms',
          localField: 'program',
          foreignField: '_id',
          as: 'program',
        },
      },
      { $unwind: '$program' },
    ]);
    const result = await cursorAgg?.toArray();
    const totalTrainningPoint = result.reduce(
      (x: any, y: any) => (x.program?.point ?? 0) + (y.program?.point ?? 0),
      0,
    );
    return totalTrainningPoint + trainningPointDefault;
  }
}
