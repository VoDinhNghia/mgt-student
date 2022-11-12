import { Controller, Post, UseGuards, Body, Req, Get, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './modules/auth/auth.service';
import { LoginDto } from './modules/auth/dtos/auth.login.dto';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService }  from 'src/modules/users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('auth/init-admin')
  async initAdmin() {
    return await this.userService.initAdmin();
  }

  @Post('auth/login')
  async login(@Body() LoginDto: LoginDto): Promise<LoginDto> {
    const checkUser: any = await this.authService.login(LoginDto);
    if (!checkUser) {
      throw new HttpException({ statusCode: 401, error: 'User or password incorrect.' }, 500);
    }
    return checkUser;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
