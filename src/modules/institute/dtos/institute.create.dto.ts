import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class CreateInstituteDto {
  @ApiProperty({ required: true })
  unitName?: string;

  @ApiProperty({ required: true })
  url?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiProperty({ required: true })
  parson?: string;

  @ApiProperty({ required: true })
  viceParson?: string;

  @ApiProperty({ type: ContactInstituteDto, required: true })
  contacts?: ContactInstituteDto;

  @ApiProperty({ required: true, type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: true, type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: false })
  attachment?: string[];
}
