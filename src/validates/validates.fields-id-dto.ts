/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniq } from 'lodash';
import { Types } from 'mongoose';
import { HttpStatusCode } from 'src/constants/constants.http-status';
import { CommonException } from 'src/exceptions/execeptions.common-error';

export class ValidFields {
  async idList(schema: any, ids: string[]): Promise<string[]> {
    if (ids.length === 0) {
      return ids;
    }
    const idsUniq = uniq(ids);
    const listIds = [];
    for (const id of idsUniq) {
      try {
        listIds.push(new Types.ObjectId(id));
      } catch {
        continue;
      }
    }
    const results = await schema.find({
      _id: { $in: listIds },
      isDeleted: false,
    });
    const documentIds = results.map((document: Record<string, any>) => {
      return document._id;
    });
    return documentIds;
  }

  async id(schema: any, id: string, message: string): Promise<void> {
    const result = await schema.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    });
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, message);
    }
  }
}
