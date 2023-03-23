import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class UpdateCenterDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  introduction?: string;

  @ApiPropertyOptional()
  director?: string;

  @ApiPropertyOptional({
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiPropertyOptional({ type: [String] })
  award?: string[];

  @ApiPropertyOptional({ type: CenterContacts })
  contacts?: CenterContacts;
}
