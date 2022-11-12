import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Put,
  Get,
  Req,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { validateEmail } from 'src/commons/validateEmail';
import { UsersUpdateDto } from './dto/user.update.dto';
import { RoleGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // when need user info inside request then use
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(@Body() UsersCreateDto: UsersCreateDto, @Req() req: Request, @Res() res: Response) {
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
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create user success.'
    });
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async update(@Param('id') id: string, @Body() UpdateDto: UsersUpdateDto, @Req() req: Request, @Res() res: Response) {
    const { user }: any = req;
    if (UpdateDto.email && !validateEmail(UpdateDto.email)) {
      throw new HttpException({ statusCode: 400, error: 'Email not correct format.' }, 400);
    }
    const result = await this.service.update(id, UpdateDto, user.userId);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Update user success.'
    });
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getAllUsers(@Res() res: Response) {
    const result = await this.service.getAll();
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get All user success.'
    });
  }
}
