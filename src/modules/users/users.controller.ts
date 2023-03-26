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
import { getDataFromCsvFileUpload } from 'src/utils/utils.getDataFromCsvUpload';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

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
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createUser(userDto, createdBy);
    return new ResponseRequest(res, result, msgResponse.createUser);
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
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const rawData = readFileSync(file.path, 'utf8');
    const csvData = getDataFromCsvFileUpload(rawData);
    const result = await this.service.importUser(createdBy, csvData);
    return new ResponseRequest(res, result, msgResponse.importUser);
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
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateUser(id, updateDto, updatedBy);
    return new ResponseRequest(res, result, msgResponse.updateUser);
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
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateUserProfile(
      id,
      updateProfileDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateUserProfile);
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
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createLeaderSchool(
      leaderSchoolDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createLeaderSchool);
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
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateLeaderSchool(
      id,
      updateLeaderDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateLeaderSchool);
  }

  @Get('/leader-school')
  async getAllLeaderSchools(
    @Query() queryLeaderDto: QueryLeaderSchoolDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllLeaderSchool(queryLeaderDto);
    return new ResponseRequest(res, results, msgResponse.getAllLeaderSchool);
  }

  @Get('/leader-school/:id')
  async getLeaderSchoolById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findLeaderSchoolById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdLeaderSchool);
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
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteLeaderSchool(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deleteLeaderSchool);
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
    const user: UserLoginResponseDto = req?.user;
    const result = await this.service.findAllUsers(queryDto, user._id);
    return new ResponseRequest(res, result, msgResponse.getAllUser);
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
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteUser(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deleteUser);
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
    return new ResponseRequest(res, result, msgResponse.getByIdUser);
  }
}
