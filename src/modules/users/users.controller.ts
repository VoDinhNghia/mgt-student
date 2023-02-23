import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Get,
  Delete,
  Req,
  Res,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi, statusUser } from 'src/commons/constants';
import { UsersUpdateDto } from './dto/user.update.dto';
import { RoleGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response, Express } from 'express';
import { UsersFillterDto } from './dto/user.filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageObjectDto } from './dto/user.file-upload.dto';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';
import { ProfileUpdateDto } from './dto/user.update-profile.dto';
import { ResponseRequest } from 'src/abstracts/responseApi';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // when need user info inside request then use
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const userId: string = user._id;
    const result = await this.service.createUser(usersCreateDto, userId);
    return new ResponseRequest(res, result, 'Create user success');
  }

  @Post('import')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/files/import-user',
      }),
    }),
  )
  async importUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const userBy: string = user.userId;
    const data: any = readFileSync(file.path, 'utf8');
    const result = await this.service.importUser(userBy, JSON.parse(data));
    return new ResponseRequest(res, result, 'Import multi user success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UsersUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const result = await this.service.updateUser(id, updateDto, user.userId);
    return new ResponseRequest(res, result, 'Update user success');
  }

  @Put('/profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: ProfileUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const result = await this.service.updateProfile(
      id,
      updateProfileDto,
      user.userId,
    );
    return new ResponseRequest(res, result, 'Update profile user success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getAllUsers(
    @Query() usersFillterDto: UsersFillterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.getAll(usersFillterDto);
    return new ResponseRequest(res, result, 'Get all users success');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const result = await this.service.updateUser(
      id,
      { status: statusUser.INACTIVE },
      user.userId,
    );
    return new ResponseRequest(res, result, 'Delete user success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getUserByid(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findUserById(id);
    return new ResponseRequest(res, result, 'Get user by id success');
  }
}
