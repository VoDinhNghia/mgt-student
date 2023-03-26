import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class CreateCenterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  introduction?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  award?: string[];

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CenterContacts)
  @ApiProperty()
  contacts?: CenterContacts;
}
