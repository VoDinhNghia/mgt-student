import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ]),
  ],
  providers: [UnionsService],
  controllers: [UnionsController],
})
export class UnionsModule {}
