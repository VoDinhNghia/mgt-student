import { Types } from 'mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';
import { CommonException } from 'src/exceptions/exeception.common-error';

export class ValidateDto {
  db = new DbConnection();

  async attachmentIds(ids = []): Promise<string[]> {
    if (ids.length === 0) {
      return ids;
    }
    const listIds = [];
    for (const id of ids) {
      try {
        listIds.push(new Types.ObjectId(id));
      } catch {
        continue;
      }
    }
    const cursorFind = await this.db
      .collection('attachments')
      .find({ _id: { $in: listIds } });
    const findAttachments = await cursorFind.toArray();
    const attachmentIds = findAttachments.map(
      (attachment: Record<string, any>) => {
        return attachment._id;
      },
    );
    return attachmentIds;
  }

  async checkFieldId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id) });
    if (!result) {
      new CommonException(404, `Not found ${id} in collection ${collection}.`);
    }
  }

  async checkExistedId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id) });
    if (!result) {
      new CommonException(
        404,
        `${id} existed already in collection ${collection}.`,
      );
    }
  }

  async checkExistedByOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db.collection(collection).findOne(options);
    if (!result) {
      new CommonException(
        404,
        `${message} existed already in collection ${collection}.`,
      );
    }
  }
}
