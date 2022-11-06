import { CountriesDto } from './countries.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountriesDto extends CountriesDto {
    @ApiProperty()
    updatedAt: Date;
}