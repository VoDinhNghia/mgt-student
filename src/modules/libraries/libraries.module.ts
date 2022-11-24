import { Module } from '@nestjs/common';
import { LibrariesController } from './libraries.controller';

@Module({
  controllers: [LibrariesController]
})
export class LibrariesModule {}
