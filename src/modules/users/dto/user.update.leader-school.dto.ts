import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { TitleLeaDerSchoolDto } from './user.create.leader-school.title.dto';

export class UpdateLeaderSchoolDto {
  @IsArray()
  @ApiProperty({ type: [TitleLeaDerSchoolDto] })
  title?: TitleLeaDerSchoolDto[];
}
