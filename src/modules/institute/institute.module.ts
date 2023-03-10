import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';
import { Institudes, InstitudeSchema } from './schemas/institute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institudes.name, schema: InstitudeSchema },
    ]),
  ],
  providers: [InstituteService],
  controllers: [InstituteController],
})
export class InstituteModule {}
