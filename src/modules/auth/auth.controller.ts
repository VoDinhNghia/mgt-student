import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.login.dto';
import { JwtAuthGuard } from './guards/auth.jwt-auth.guard';
import { Request, Response } from 'express';
import { InitSuperAdminDto } from './dtos/auth.init-super-admin.dto';
import { ResponseLoginApiDto } from './dtos/auth.api.login.response.dto';
import {
  descriptionMsg,
  authMsg,
} from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from './dtos/auth.result.login-service.dto';
import { authController } from 'src/constants/constants.controller.name-tag';

@Controller(authController.name)
@ApiTags(authController.tag)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/init-supper-admin')
  public async initAdmin(
    @Body() superAdminDto: InitSuperAdminDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.userService.initSupperAdmin(superAdminDto);

    return new ResponseRequest(res, result, authMsg.createSupperAdmin);
  }

  @Post('/login')
  @ApiOkResponse({
    description: descriptionMsg.apiLogin,
    type: ResponseLoginApiDto,
    isArray: false,
  })
  public async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const checkUser = await this.authService.login(loginDto);

    return new ResponseRequest(res, checkUser, authMsg.login);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  public async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const result = await this.userService.findUserById(user._id);

    return new ResponseRequest(res, result, authMsg.getMe);
  }
}
