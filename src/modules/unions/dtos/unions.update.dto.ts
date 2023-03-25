import { PartialType } from '@nestjs/swagger';
import { CreateUnionDto } from './unions.create.dto';

export class UpdateUnionDto extends PartialType(CreateUnionDto) {}
