import { ObjectId, Types } from 'mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';
import { CommonException } from 'src/exceptions/exeception.common-error';

export class SubjectUserRegister {
  db = new DbConnection();

  async getUserSubjects(
    profile: string,
    subjectIds: ObjectId[],
  ): Promise<Record<string, any>[]> {
    const studyprocess = await this.db
      .collection('studyprocesses')
      .findOne({ user: new Types.ObjectId(profile) });
    if (!studyprocess) {
      new CommonException(404, 'user study processes not found.');
    }
    const match = {
      $match: {
        subject: { $in: subjectIds },
        studyprocess: studyprocess._id,
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
      .collection('subjectregisters')
      .aggregate(aggregate);
    const result = await cursorAgg.toArray();
    return result ?? [];
  }

  async getSubjectIds(semester: string): Promise<ObjectId[]> {
    const cursorQuery = await this.db
      .collection('subjects')
      .find({ semester: new Types.ObjectId(semester), status: true });
    const subjectList = await cursorQuery.toArray();
    const subjectIds = subjectList.map((subject: any) => {
      return subject._id;
    });
    return subjectIds;
  }
}
