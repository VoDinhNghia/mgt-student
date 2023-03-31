import { PartialType } from '@nestjs/swagger';
import { CreateSettingLearningRateDto } from './settings.create.learning-rate.dto';

export class UpdateSettingLearningRateDto extends PartialType(
  CreateSettingLearningRateDto,
) {}
