import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SettingLearningRate,
  SettingLearningRateSchema,
} from './schemas/settings.learning-rating.schema';
import {
  SettingSubjectPass,
  SettingSubjectPassSchema,
} from './schemas/settings.subject-pass.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SettingLearningRate.name,
        schema: SettingLearningRateSchema,
      },
      {
        name: SettingSubjectPass.name,
        schema: SettingSubjectPassSchema,
      },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
