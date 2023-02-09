import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { Award, AwardSchema } from './schemas/awards.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Award.name,
        schema: AwardSchema,
      },
    ]),
  ],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsModule {}
