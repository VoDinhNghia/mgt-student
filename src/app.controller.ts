import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './modules/auth/auth.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoginDto } from './modules/auth/dtos/auth.login.dto';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';

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
  async login(@Body() LoginDto: LoginDto, @Res() res: Response) {
    const checkUser: any = await this.authService.login(LoginDto);
    if (!checkUser) {
      throw new HttpException(
        { statusCode: 401, error: 'User or password incorrect.' },
        500,
      );
    }
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: checkUser,
      message: 'Login success.',
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  getProfile(@Req() req: Request, @Res() res: Response) {
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: req.user,
      message: 'Get me success.',
    });
  }
}
