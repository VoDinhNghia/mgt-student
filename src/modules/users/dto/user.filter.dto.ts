import { ApiProperty } from '@nestjs/swagger';
import { statusUser, ErolesEnum } from 'src/commons/constants';

export class UsersFillterDto {
  @ApiProperty({ required: false, enum: ErolesEnum })
  role?: string;

  @ApiProperty({ required: false, enum: statusUser.ENUM })
  status?: string;

  @ApiProperty({ required: false })
  limit?: string;

  @ApiProperty({ required: false })
  page?: string;

  @ApiProperty({ required: false })
  searchKey?: string;
}
