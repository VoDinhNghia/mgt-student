import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { EtypeSettingSubjectPass } from 'src/constants/constant';

export class CreateSettingSubjectPassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Condition accumulated point' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: EtypeSettingSubjectPass.ACCUMULATED_POINT,
  })
  type?: string;

  @IsNumber()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty({ default: 4.0 })
  condition?: number;
}
