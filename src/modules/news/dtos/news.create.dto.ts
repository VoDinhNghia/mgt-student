import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  @ApiProperty()
  url?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];
}
