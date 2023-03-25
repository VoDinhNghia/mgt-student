import { PartialType } from '@nestjs/swagger';
import { CreateCenterDto } from './centers.create.dto';

export class UpdateCenterDto extends PartialType(CreateCenterDto) {}
