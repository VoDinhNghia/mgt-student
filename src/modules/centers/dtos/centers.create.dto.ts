import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class CreateCenterDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  introduction?: string;

  @ApiProperty({ required: true })
  director?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiProperty({ required: false, type: [String] })
  award?: string[];

  @ApiProperty({ required: true, type: CenterContacts })
  contacts?: CenterContacts;
}
