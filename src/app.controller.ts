import { Controller, Post, UseGuards, Body, Req, Get, HttpException } from '@nestjs/common';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { Request } from 'express';
import { AuthService } from './modules/auth/auth.service';
import { LoginDto } from './modules/auth/dtos/auth.login.dto';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() LoginDto: LoginDto, @Req() req: Request) {
    const checkUser = await this.authService.login(req.body);
    if (!checkUser) {
      throw new HttpException(
        {
          statusCode: 401,
          error: 'User or password incorrect.',
        },
        500,
      );
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
