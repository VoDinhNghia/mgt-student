import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { CenterContacts } from './centers.contacts.dto';

export class CreateCenterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  introduction?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director?: string;

  @ApiProperty({
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiPropertyOptional({ type: [String] })
  award?: string[];

  @IsObject()
  @ApiProperty({ type: CenterContacts })
  contacts?: CenterContacts;
}
