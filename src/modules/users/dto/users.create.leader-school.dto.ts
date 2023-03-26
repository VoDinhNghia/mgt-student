import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TitleLeaDerSchoolDto } from './users.create.leader-school.title.dto';

export class CreateLeaderSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TitleLeaDerSchoolDto)
  @ApiProperty({ type: [TitleLeaDerSchoolDto] })
  title?: TitleLeaDerSchoolDto[];
}
