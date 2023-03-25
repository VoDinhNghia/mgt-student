import { PartialType } from '@nestjs/swagger';
import { CreateAwardDto } from './awards.create.dto';

export class UpdateAwardDto extends PartialType(CreateAwardDto) {}
