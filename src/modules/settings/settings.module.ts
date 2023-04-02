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
import {
  SettingMoneyCredit,
  SettingMoneyCreditSchema,
} from './schemas/settings.money-credit.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';

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
      {
        name: SettingMoneyCredit.name,
        schema: SettingMoneyCreditSchema,
      },
      {
        name: Semester.name,
        schema: SemesterSchema,
      },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
