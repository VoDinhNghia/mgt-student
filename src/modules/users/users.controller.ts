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
import { UsersUpdateDto } from './dto/users.update.dto';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { Request, Response, Express } from 'express';
import { UsersFillterDto } from './dto/users.query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageObjectDto } from './dto/users.file-upload.dto';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';
import { UpdateProfileDto } from './dto/users.update.profile.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { CreateLeaderSchoolDto } from './dto/users.create.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/users.update.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/users.query.leader-school.dto';
import {
  csvFileFilter,
  destinationImportUser,
  fileName,
} from 'src/validates/validates.attachment.upload-file';
import { getDataFromCsvFileUpload } from 'src/utils/utils.get.data-from-csv-upload';
import { userMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { userController } from 'src/constants/constants.controller.name-tag';

@Controller(userController.name)
@ApiTags(userController.tag)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createUser(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createUser(userDto, profileId);

    return new ResponseRequest(res, result, userMsg.create);
  }

  @Post('/import-user')
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
  public async importUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const rawData = readFileSync(file.path, 'utf8');
    const csvData = getDataFromCsvFileUpload(rawData);
    const result = await this.service.importUser(profileId, csvData);

    return new ResponseRequest(res, result, userMsg.importUser);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UsersUpdateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateUser(id, updateDto, profileId);

    return new ResponseRequest(res, result, userMsg.update);
  }

  @Put('/profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateUserProfile(
      id,
      updateProfileDto,
      profileId,
    );

    return new ResponseRequest(res, result, userMsg.updateUserProfile);
  }

  @Post('/leader-school')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createLeaderSchool(
    @Body() leaderSchoolDto: CreateLeaderSchoolDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createLeaderSchool(
      leaderSchoolDto,
      profileId,
    );

    return new ResponseRequest(res, result, userMsg.createLeaderSchool);
  }

  @Put('/leader-school/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateLeaderSchool(
    @Param('id') id: string,
    @Body() updateLeaderDto: UpdateLeaderSchoolDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateLeaderSchool(
      id,
      updateLeaderDto,
      profileId,
    );

    return new ResponseRequest(res, result, userMsg.updateLeaderSchool);
  }

  @Get('/leader-school')
  public async getAllLeaderSchools(
    @Query() queryLeaderDto: QueryLeaderSchoolDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllLeaderSchool(queryLeaderDto);

    return new ResponseRequest(res, results, userMsg.getAllLeaderSchools);
  }

  @Get('/leader-school/:id')
  public async getLeaderSchoolById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findLeaderSchoolById(id);

    return new ResponseRequest(res, result, userMsg.getByIdLeaderSchools);
  }

  @Delete('/leader-school/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteLeaderSchoolById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteLeaderSchool(id, profileId);

    return new ResponseRequest(res, true, userMsg.deleteLeaderSchool);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getAllUsers(
    @Query() queryDto: UsersFillterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const result = await this.service.findAllUsers(queryDto, user._id);

    return new ResponseRequest(res, result, userMsg.getAll);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteUser(id, profileId);

    return new ResponseRequest(res, true, userMsg.delete);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getUserByid(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findUserById(id);

    return new ResponseRequest(res, result, userMsg.getById);
  }
}
