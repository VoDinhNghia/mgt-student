import { ApiProperty } from '@nestjs/swagger';
import { TitleLeaDerSchoolDto } from './user.create.leader-school.title.dto';

export class UpdateLeaderSchoolDto {
  @ApiProperty({ required: true, type: [TitleLeaDerSchoolDto] })
  title?: TitleLeaDerSchoolDto[];
}
