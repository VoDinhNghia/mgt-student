import { CommonException } from './execeptionError';

export class ValidateField {
  async byId(schema: any, id: string, message: string): Promise<void> {
    const existed = await schema.findById(id);
    if (!existed) {
      new CommonException(404, `${message} not found.`);
    }
  }
}
