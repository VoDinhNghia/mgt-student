import { ApiProperty } from '@nestjs/swagger';
import { CenterContacts } from './center.contacts.dto';

export class UpdateCenterDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  introduction?: string;

  @ApiProperty({ required: false })
  director?: string;

  @ApiProperty({ required: false })
  foundYear?: string;

  @ApiProperty({ required: false, type: [String] })
  award?: string[];

  @ApiProperty({ required: false, type: CenterContacts })
  contacts?: CenterContacts;
}
