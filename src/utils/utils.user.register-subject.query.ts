/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId, Types } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { DbConnection } from 'src/constants/constants.db.mongo.connection';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { SubjectDocument } from 'src/modules/class-subject/schemas/class-subject.subject.schema';

export class SubjectUserRegister {
  db = new DbConnection();

  async findOneStudyProcess(profile: string) {
    const query = { user: new Types.ObjectId(profile), isDeleted: false };
    const result = await this.db
      .collection(collections.study_processes)
      .findOne(query);
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
          from: collections.subjects,
          localField: 'subject',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: '$subject' },
    ];
    const cursorAgg = await this.db
      .collection(collections.subject_registers)
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
    const cursorQuery = await this.db
      .collection(collections.subjects)
      .find(query);
    const subjectList = await cursorQuery.toArray();
    const subjectIds = subjectList.map((subject: SubjectDocument) => {
      return subject._id;
    });
    return subjectIds;
  }

  async getUserTotalAccumalated(
    semester: string,
    profileId: string,
  ): Promise<{ totalAccumalated: number; totalNumberCredits: number }> {
    const subjectIds = await this.getSubjectIds(semester);
    const result = await this.getUserSubjects(profileId, subjectIds);
    let totalAccumalated = 0;
    let totalNumberCredits = 0;
    if (result.length <= 0) {
      return { totalAccumalated, totalNumberCredits };
    }
    for (const item of result) {
      if (item.subject?.calculateCumulativePoint) {
        totalAccumalated +=
          (item?.accumalatedPoint || 0) * item?.subject?.numberCredits;
        totalNumberCredits += item?.subject?.numberCredits || 0;
      }
    }
    return { totalAccumalated, totalNumberCredits };
  }
}
