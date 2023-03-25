import { PartialType } from '@nestjs/swagger';
import { CreateDegreeLevelDto } from './degreelevels.create.dto';

export class UpdateDegreeLevelDto extends PartialType(CreateDegreeLevelDto) {}
