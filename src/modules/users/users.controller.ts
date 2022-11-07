import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(@Body() UsersCreateDto: UsersCreateDto) {
    const result = await this.service.create(UsersCreateDto);
    if (!result) {
      throw new HttpException(
        {
          statusCode: 500,
          error: 'Server error.',
        },
        500,
      );
    }
    return result;
  }
}
