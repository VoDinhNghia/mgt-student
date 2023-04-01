import { PartialType } from '@nestjs/swagger';
import { CreateTrainningPointDto } from './trainning-point.create.dto';

export class UpdateTrainningPointDto extends PartialType(
  CreateTrainningPointDto,
) {}
