import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import {
  SubjectDocument,
  Subjects,
} from 'src/modules/class-subject/schemas/class-subject.subject.schema';
import { IuserSubjectRegister } from 'src/modules/scholarships/interfaces/scholarships.interface';
import {
  SubjectRegisterDocument,
  SubjectRegisters,
} from 'src/modules/study-process/schemas/study-process.subject.schema';

@Injectable()
export class SubjectUserRegister {
  constructor(
    @InjectModel(SubjectRegisters.name)
    private readonly subjectRegisterSchema: Model<SubjectRegisterDocument>,
    @InjectModel(Subjects.name)
    private readonly subjectSchema: Model<SubjectDocument>,
  ) {}

  public async getUserSubjects(
    studyprocess: string,
    subjectIds: ObjectId[],
  ): Promise<IuserSubjectRegister[]> {
    const match = {
      $match: {
        subject: { $in: subjectIds },
        studyprocess: new Types.ObjectId(studyprocess),
        isDeleted: false,
      },
    };
    const aggregate = [
      match,
      {
        $lookup: {
          from: collections.subjects,
          localField: 'subject',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: '$subject' },
    ];
    const results = await this.subjectRegisterSchema.aggregate(aggregate);

    return results;
  }

  public async getSubjectIds(semester: string): Promise<ObjectId[]> {
    const query = {
      semester: new Types.ObjectId(semester),
      status: true,
      isDeleted: false,
    };
    const subjectList = await this.subjectSchema.find(query);
    const subjectIds = subjectList.map((subject: SubjectDocument) => {
      return subject._id;
    });

    return subjectIds;
  }
}
