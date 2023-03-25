import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { TitleLeaDerSchoolDto } from './users.create.leader-school.title.dto';

export class CreateLeaderSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsArray()
  @ApiProperty({ type: [TitleLeaDerSchoolDto] })
  title?: TitleLeaDerSchoolDto[];
}
