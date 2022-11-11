import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { permission } from 'src/commons/constants';
import { validateRoleAccess } from 'src/commons/validateRoleAccess';
import { validateEmail } from 'src/commons/validateEmail';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() UsersCreateDto: UsersCreateDto, @Req() req: Request) {
    const { user }: any = req;
    const { email } = UsersCreateDto;
    if (!validateRoleAccess(permission.ADMIN, user.role || '')) {
      throw new HttpException({ statusCode: 403, error: 'You are have permission.' }, 403);
    }
    if (!validateEmail(email)) {
      throw new HttpException({ statusCode: 400, error: 'Email not correct format.' }, 400);
    }
    const existedUser = await this.service.findByEmail(email);
    if (!existedUser) {
      throw new HttpException({ statusCode: 400, error: 'User existed.' }, 400);
    }
    const result = await this.service.create(UsersCreateDto);
    if (!result) {
      throw new HttpException({ statusCode: 500, error: 'Server error.' }, 500);
    }
    return result;
  }
}
