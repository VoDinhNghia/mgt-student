import { ApiProperty } from '@nestjs/swagger';
import { CenterContacts } from './centers.contacts.dto';

export class CreateCenterDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  introduction?: string;

  @ApiProperty({ required: true })
  director?: string;

  @ApiProperty({ required: true })
  foundYear?: string;

  @ApiProperty({ required: false, type: [String] })
  award?: string[];

  @ApiProperty({ required: true, type: CenterContacts })
  contacts?: CenterContacts;
}
