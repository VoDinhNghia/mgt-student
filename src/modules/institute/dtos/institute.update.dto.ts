import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class UpdateInstituteDto {
  @ApiPropertyOptional()
  unitName?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  foundYear?: Date;

  @ApiPropertyOptional()
  parson?: string;

  @ApiPropertyOptional()
  viceParson?: string;

  @ApiPropertyOptional({ type: ContactInstituteDto })
  contacts?: ContactInstituteDto;

  @ApiPropertyOptional({ type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @ApiPropertyOptional({ type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @ApiPropertyOptional()
  attachment?: string[];
}
