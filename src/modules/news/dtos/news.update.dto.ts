import { PartialType } from '@nestjs/swagger';
import { CreateNewDto } from './news.create.dto';

export class UpdateNewDto extends PartialType(CreateNewDto) {}
