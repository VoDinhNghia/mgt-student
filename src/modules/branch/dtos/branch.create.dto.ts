import { ApiProperty } from '@nestjs/swagger';
import { BranchContactInfoDto } from './branch.contact-info.dto';
import { BranchLocationDto } from './branch.location.dto';

export class BranchCreateDto {
  @ApiProperty({ required: true })
  title?: string;

  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  website?: number;

  @ApiProperty({ type: BranchLocationDto, required: true })
  location?: BranchLocationDto;

  @ApiProperty({ required: true, type: [BranchContactInfoDto] })
  contactInfo?: [BranchContactInfoDto];
}
