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
import { CreateUserDto } from './dto/users.create.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { UsersUpdateDto } from './dto/user.update.dto';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response, Express } from 'express';
import { UsersFillterDto } from './dto/user.filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageObjectDto } from './dto/user.file-upload.dto';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';
import { UpdateProfileDto } from './dto/user.update-profile.dto';
import { ResponseRequest } from 'src/utils/response-api';
import { CreateLeaderSchoolDto } from './dto/user.create.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/user.update.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/user.query.leader-school.dto';
import {
  csvFileFilter,
  destinationImportUser,
  fileName,
} from 'src/validates/validate.attachment.upload-file';
import { getDataFromCsvFileUpload } from 'src/utils/getDataFromCsvUpload';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createUser(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.service.createUser(userDto, createdBy);
    return new ResponseRequest(res, result, 'Create user success');
  }

  @Post('import')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: csvFileFilter,
      storage: diskStorage({
        destination: destinationImportUser,
        filename: fileName,
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
    const createdBy: string = user.profile;
    const rawData = readFileSync(file.path, 'utf8');
    const csvData = getDataFromCsvFileUpload(rawData);
    const result = await this.service.importUser(createdBy, csvData);
    return new ResponseRequest(res, result, 'Import multi user success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UsersUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profile;
    const result = await this.service.updateUser(id, updateDto, updatedBy);
    return new ResponseRequest(res, result, 'Update user success');
  }

  @Put('/profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profile;
    const result = await this.service.updateUserProfile(
      id,
      updateProfileDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, 'Update profile user success');
  }

  @Post('/leader-school')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createLeaderSchool(
    @Body() leaderSchoolDto: CreateLeaderSchoolDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profile;
    const result = await this.service.createLeaderSchool(
      leaderSchoolDto,
      createdBy,
    );
    return new ResponseRequest(res, result, 'Create leader school success.');
  }

  @Put('/leader-school/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateLeaderSchool(
    @Param('id') id: string,
    @Body() updateLeaderDto: UpdateLeaderSchoolDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profile;
    const result = await this.service.updateLeaderSchool(
      id,
      updateLeaderDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, 'Update leader school success.');
  }

  @Get('/leader-school')
  async getAllLeaderSchools(
    @Query() queryLeaderDto: QueryLeaderSchoolDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllLeaderSchool(queryLeaderDto);
    return new ResponseRequest(res, results, 'Get all leader school succees.');
  }

  @Get('/leader-school/:id')
  async getLeaderSchoolById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findLeaderSchoolById(id);
    return new ResponseRequest(res, result, 'Get leader school succees.');
  }

  @Delete('/leader-school/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteLeaderSchoolById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profile;
    await this.service.deleteLeaderSchool(id, deletedBy);
    return new ResponseRequest(res, true, 'Delete leader school succees.');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllUsers(
    @Query() queryDto: UsersFillterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const result = await this.service.findAllUsers(queryDto, user.userId);
    return new ResponseRequest(res, result, 'Get all users success');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profileId;
    const result = await this.service.deleteUser(id, deletedBy);
    return new ResponseRequest(res, result, 'Delete user success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getUserByid(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findUserById(id);
    return new ResponseRequest(res, result, 'Get user by id success');
  }
}
