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
import { ResponseRequest } from 'src/utils/response-api';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { InitSuperAdminDto } from './dtos/auth.init-super-admin.dto';
import { ResponseLoginApiDto } from './dtos/auth.api.login.response.dto';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/init-supper-admin')
  async initAdmin(
    @Body() superAdminDto: InitSuperAdminDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.userService.initSupperAdmin(superAdminDto);
    return new ResponseRequest(res, result, 'Create supper admin success');
  }

  @Post('/login')
  @ApiOkResponse({ type: ResponseLoginApiDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const checkUser = await this.authService.login(loginDto);
    return new ResponseRequest(res, checkUser, `Login sucess.`);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    return new ResponseRequest(res, user, `Get me success.`);
  }
}
