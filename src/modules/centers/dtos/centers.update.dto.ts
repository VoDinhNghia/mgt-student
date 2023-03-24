import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class UpdateCenterDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  introduction?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  director?: string;

  @IsOptional()
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

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: CenterContacts })
  contacts?: CenterContacts;
}
