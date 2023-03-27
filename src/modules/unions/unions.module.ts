import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnionImages, UnionImageSchema } from './schemas/unions.images.schema';
import {
  UnionMembers,
  UnionMemberSchema,
} from './schemas/unions.members.schema';
import { Union, UnionSchema } from './schemas/unions.schema';
import { UnionsController } from './unions.controller';
import { UnionsService } from './unions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Union.name,
        schema: UnionSchema,
      },
      {
        name: UnionMembers.name,
        schema: UnionMemberSchema,
      },
      {
        name: UnionImages.name,
        schema: UnionImageSchema,
      },
    ]),
  ],
  providers: [UnionsService],
  controllers: [UnionsController],
})
export class UnionsModule {}
