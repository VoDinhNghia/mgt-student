import { PartialType } from '@nestjs/swagger';
import { CreateUnionImagesDto } from './unions.create.images.dto';

export class UpdateUnionImage extends PartialType(CreateUnionImagesDto) {}
