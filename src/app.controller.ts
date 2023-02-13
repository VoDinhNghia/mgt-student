import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './modules/auth/auth.service';
import { LoginDto } from './modules/auth/dtos/auth.login.dto';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { CommonException } from './abstracts/execeptionError';
import { ResponseRequest } from './abstracts/responseApi';
import { cryptoPassWord } from './commons/crypto';

@Controller('auth')
@ApiTags('auth')
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/init-admin')
  async initAdmin(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.userService.initAdmin();
    return new ResponseRequest(res, result, 'Create admin success');
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const checkUser = await this.authService.login(loginDto);
    if (!checkUser) {
      new CommonException(401, `User or password incorrect.`);
    }
    return new ResponseRequest(res, checkUser, `Login sucess.`);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    return new ResponseRequest(res, user, `Get me success.`);
  }

  @Get('/crypto/:pass')
  getCryptoPass(@Param('pass') passWord: string, @Res() res: Response) {
    const cipher = cryptoPassWord(passWord);
    return new ResponseRequest(res, cipher, `Get crypto password success.`);
  }
}
