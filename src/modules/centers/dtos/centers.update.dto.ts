import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class UpdateCenterDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  introduction?: string;

  @ApiProperty({ required: false })
  director?: string;

  @ApiProperty({
    required: false,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiProperty({ required: false, type: [String] })
  award?: string[];

  @ApiProperty({ required: false, type: CenterContacts })
  contacts?: CenterContacts;
}
