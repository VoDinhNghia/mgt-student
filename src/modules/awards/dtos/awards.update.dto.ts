import { ApiPropertyOptional } from '@nestjs/swagger';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateAwardDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:00`,
  })
  time?: Date;

  @ApiPropertyOptional({ type: [String] })
  attachment?: [string];

  @ApiPropertyOptional({ default: 'award - location' })
  location?: string;

  @ApiPropertyOptional({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiPropertyOptional()
  description?: string;
}
