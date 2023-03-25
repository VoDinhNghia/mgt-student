import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class StorageObjectDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
