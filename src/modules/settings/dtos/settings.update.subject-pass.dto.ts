import { PartialType } from '@nestjs/swagger';
import { CreateSettingSubjectPassDto } from './settings.create.subject-pass.dto';

export class UpdateSettingSubjectPassDto extends PartialType(
  CreateSettingSubjectPassDto,
) {}
