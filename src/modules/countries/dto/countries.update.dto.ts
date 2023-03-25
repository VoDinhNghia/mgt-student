import { PartialType } from '@nestjs/swagger';
import { CreateCoutriesDto } from './countries.create.dto';

export class UpdateCountriesDto extends PartialType(CreateCoutriesDto) {}
