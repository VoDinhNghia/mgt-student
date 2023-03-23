import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EtypeNews } from 'src/constants/constant';
export class CreateNewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: EtypeNews,
    default: EtypeNews.UNIVERSITY,
  })
  type?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
