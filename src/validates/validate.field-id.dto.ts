import { CommonException } from '../exceptions/exeception.common-error';

export class ValidateField {
  async byId(schema: any, id: string, message: string): Promise<void> {
    const result = await schema.findById(id);
    if (!result) {
      new CommonException(404, `${message} not found.`);
    }
  }

  async existed(
    schema: any,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await schema.findOne(options);
    if (result) {
      new CommonException(409, `${message} existed already.`);
    }
  }
}
