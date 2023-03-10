import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class UpdateInstituteDto {
  @ApiProperty({ required: false })
  unitName?: string;

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({
    required: false,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiProperty({ required: false })
  parson?: string;

  @ApiProperty({ required: false })
  viceParson?: string;

  @ApiProperty({ type: ContactInstituteDto, required: false })
  contacts?: ContactInstituteDto;

  @ApiProperty({ required: false, type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: false, type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: false })
  attachment?: string[];
}
