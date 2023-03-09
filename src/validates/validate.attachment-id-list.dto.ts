import { Types } from 'mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';

export class ValidateAttachmentIds {
  db = new DbConnection();

  async validate(ids = []): Promise<string[]> {
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
}
