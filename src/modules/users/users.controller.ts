import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { validateEmail } from 'src/commons/validateEmail';
import { UsersUpdateDto } from './dto/user.update.dto';
import { RoleGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // when need user info inside request then use
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(@Body() UsersCreateDto: UsersCreateDto, @Req() req: Request) {
    const { user }: any = req;
    const { email } = UsersCreateDto;
    if (!validateEmail(email)) {
      throw new HttpException({ statusCode: 400, error: 'Email not correct format.' }, 400);
    }
    const existedUser = await this.service.findByEmail(email);
    if (existedUser) {
      throw new HttpException({ statusCode: 400, error: 'User existed.' }, 400);
    }
    const result = await this.service.create(UsersCreateDto, user.userId);
    if (!result) {
      throw new HttpException({ statusCode: 500, error: 'Server error.' }, 500);
    }
    return result;
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async update(@Body() UpdateDto: UsersUpdateDto, @Req() req: Request) {
    const { user }: any = req;
    if (UpdateDto.email && !validateEmail(UpdateDto.email)) {
      throw new HttpException({ statusCode: 400, error: 'Email not correct format.' }, 400);
    }
    return await this.service.update(UpdateDto.id, UpdateDto, user.userId);
  }
}
