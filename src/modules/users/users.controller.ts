import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Put,
  Get,
  Delete,
  Req,
  Res,
  HttpStatus,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi, statusUser } from 'src/commons/constants';
import { validateEmail } from 'src/commons/validateEmail';
import { UsersUpdateDto } from './dto/user.update.dto';
import { RoleGuard } from '../auth/role-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response, Express } from 'express';
import { UsersFillterDto } from './dto/user.filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageObjectDto } from './dto/user.file-upload.dto';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // when need user info inside request then use
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { user }: Request | any = req;
    const userId: string = user._id;
    const { email } = usersCreateDto;
    if (!validateEmail(email)) {
      throw new HttpException(
        { statusCode: 400, error: 'Email not correct format.' },
        400,
      );
    }
    const existedUser = await this.service.findByEmail(email);
    if (existedUser) {
      throw new HttpException({ statusCode: 400, error: 'User existed.' }, 400);
    }
    const result = await this.service.create(usersCreateDto, userId);
    if (!result) {
      throw new HttpException({ statusCode: 500, error: 'Server error.' }, 500);
    }
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create user success.',
    });
  }

  @Post('import')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/files/import',
      }),
    }),
  )
  async importUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const { user }: Request | any = req;
    const userId: string = user.userId;
    const data = readFileSync(file.path, 'utf8');
    const result = await this.service.importUser(userId, data);
    console.log('importUser', result);

    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: [],
      message: 'Import multi user success.',
    });
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UsersUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { user }: Request | any = req;
    if (updateDto.email && !validateEmail(updateDto.email)) {
      throw new HttpException(
        { statusCode: 400, error: 'Email not correct format.' },
        400,
      );
    }
    const result = await this.service.update(id, updateDto, user.userId);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Update user success.',
    });
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getAllUsers(
    @Query() usersFillterDto: UsersFillterDto,
    @Res() res: Response,
  ) {
    const result = await this.service.getAll(usersFillterDto);
    let data = result;
    if (usersFillterDto.role) {
      data = data.filter((u: any) => usersFillterDto.role === u.user.role);
    }
    if (usersFillterDto.status) {
      data = data.filter((u: any) => usersFillterDto.status === u.user.status);
    }
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data,
      message: 'Get All user success.',
    });
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { user }: Request | any = req;
    const result = await this.service.update(
      id,
      { status: statusUser.INACTIVE },
      user.userId,
    );
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Delete user success.',
    });
  }
}
