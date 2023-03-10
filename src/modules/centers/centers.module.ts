import { Module } from '@nestjs/common';
import { CenterService } from './centers.service';
import { CenterController } from './centers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/centers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Center.name, schema: CenterSchema }]),
  ],
  providers: [CenterService],
  controllers: [CenterController],
})
export class CenterModule {}
