import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { DepartmentsService } from './departments.service';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { CreateDepartmentDto } from './dtos/departments.create.dto';
import { Response, Request } from 'express';
import { departmentMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { departmentController } from 'src/constants/constants.controller.name-tag';
import { QueryDepartmentDto } from './dtos/department.query.dto';

@Controller(departmentController.name)
@ApiTags(departmentController.tag)
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createDepartment(
    @Body() departmentDto: CreateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createDepartment(
      departmentDto,
      profileId,
    );

    return new ResponseRequest(res, result, departmentMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateDepartment(
    @Param('id') id: string,
    @Body() departmentDto: UpdateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateDepartment(
      id,
      departmentDto,
      profileId,
    );

    return new ResponseRequest(res, result, departmentMsg.update);
  }

  @Post('/staff/multi')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createDepartmentMultiStaff(
    @Body() staffDto: CreateMultiStaffDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createMultiStaffDepartment(
      staffDto,
      profileId,
    );

    return new ResponseRequest(res, result, departmentMsg.createMultiStaff);
  }

  @Post('/staff')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createDepartmentStaff(
    @Body() staffDto: CreateStaffDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createDepartmentStaff(
      staffDto,
      profileId,
    );

    return new ResponseRequest(res, result, departmentMsg.createStaff);
  }

  @Put('/staff/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateDepartmentStaff(
    @Param('id') id: string,
    @Body() staffDto: UpdateStaffDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateDepartmentStaff(
      id,
      staffDto,
      profileId,
    );

    return new ResponseRequest(res, result, departmentMsg.updateStaff);
  }

  @Delete('/staff/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteDepartmentStaff(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteDepartmentStaff(id, profileId);

    return new ResponseRequest(res, true, departmentMsg.deleteStaff);
  }

  @Get()
  public async getAllDepartment(
    @Query() queryDto: QueryDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllDepartment(queryDto);

    return new ResponseRequest(res, result, departmentMsg.getAll);
  }

  @Get('/:id')
  public async getDepartmentById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findDepartmentById(id);

    return new ResponseRequest(res, result, departmentMsg.getById);
  }
}
