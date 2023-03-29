import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultiesService } from './faculties.service';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { CreateMajorDto } from './dtos/faculties.major.create.dto';
import { UpdateMajorDto } from './dtos/faculties.major.update.dto';
import { MajorQueryDto } from './dtos/faculties.major.query.dto';
import { facultiesMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/faculties')
@ApiTags('faculties')
export class FacultiesController {
  constructor(private readonly facultyService: FacultiesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createFaculty(
    @Res() res: Response,
    @Body() createFacultyDto: CreateFacultyDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.facultyService.createFaculty(
      createFacultyDto,
      createdBy,
    );
    return new ResponseRequest(res, result, facultiesMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateFaculty(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.facultyService.updateFaculty(
      id,
      updateFacultyDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, facultiesMsg.update);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getListFaculties(
    @Query() facultyQueryDto: FacultyQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findAllFaculties(facultyQueryDto);
    return new ResponseRequest(res, result, facultiesMsg.getAll);
  }

  @Post('/major')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createMajor(
    @Res() res: Response,
    @Body() createMajorDto: CreateMajorDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.facultyService.createMajor(
      createMajorDto,
      createdBy,
    );
    return new ResponseRequest(res, result, facultiesMsg.createMajor);
  }

  @Put('/major/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateMajor(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.facultyService.updateMajor(
      id,
      updateMajorDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, facultiesMsg.updateMajor);
  }

  @Get('/major/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getMajorById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findMajorById(id);
    return new ResponseRequest(res, result, facultiesMsg.getByIdMajor);
  }

  @Get('/major')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getListMajors(
    @Query() queryDto: MajorQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findAllMajors(queryDto);
    return new ResponseRequest(res, result, facultiesMsg.getAllMajor);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getFacultyById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findFacultyById(id);
    return new ResponseRequest(res, result, facultiesMsg.getById);
  }
}
