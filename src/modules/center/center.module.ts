import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/center.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Center.name, schema: CenterSchema }]),
  ],
  providers: [CenterService],
  controllers: [CenterController],
})
export class CenterModule {}
