import { ObjectId, Types } from 'mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';
import { CommonException } from 'src/exceptions/exeception.common-error';

export class SubjectUserRegister {
  db = new DbConnection();

  async findOneStudyProcess(profile: string) {
    const query = { user: new Types.ObjectId(profile), isDeleted: false };
    const result = await this.db.collection('study_processes').findOne(query);
    if (!result) {
      new CommonException(404, 'user study processes not found.');
    }
    return result;
  }

  async getUserSubjects(
    profile: string,
    subjectIds: ObjectId[],
  ): Promise<Record<string, any>[]> {
    const studyprocess = await this.findOneStudyProcess(profile);
    const match = {
      $match: {
        subject: { $in: subjectIds },
        studyprocess: studyprocess._id,
        isDeleted: false,
      },
    };
    const aggregate = [
      match,
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: '$subject' },
    ];
    const cursorAgg = await this.db
      .collection('subject_registers')
      .aggregate(aggregate);
    const result = await cursorAgg.toArray();
    return result ?? [];
  }

  async getSubjectIds(semester: string): Promise<ObjectId[]> {
    const query = {
      semester: new Types.ObjectId(semester),
      status: true,
      isDeleted: false,
    };
    const cursorQuery = await this.db.collection('subjects').find(query);
    const subjectList = await cursorQuery.toArray();
    const subjectIds = subjectList.map((subject: any) => {
      return subject._id;
    });
    return subjectIds;
  }
}
