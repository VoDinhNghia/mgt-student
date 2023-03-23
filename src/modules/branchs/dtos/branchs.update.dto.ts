import { ApiPropertyOptional } from '@nestjs/swagger';
import { BranchUpdateContactInfoDto } from './branchs.update-contact-info.dto';
import { BranchUpdateLocationDto } from './branchs.update-location.dto';

export class BranchUpdateDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional({ type: BranchUpdateLocationDto })
  location?: BranchUpdateLocationDto;

  @ApiPropertyOptional({ type: [BranchUpdateContactInfoDto] })
  contactInfo?: [BranchUpdateContactInfoDto];
}
