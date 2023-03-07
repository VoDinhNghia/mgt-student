import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/response-api';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { DepartmentsService } from './departments.service';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { CreateDepartmentDto } from './dtos/departments.create.dto';

@Controller('api/departments')
@ApiTags('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createDepartment(
    @Body() departmentDto: CreateDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createDepartment(departmentDto);
    return new ResponseRequest(res, result, 'Create department success.');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateDepartment(
    @Param('id') id: string,
    @Body() departmentDto: UpdateDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.updateDepartment(id, departmentDto);
    return new ResponseRequest(res, result, 'Update department success.');
  }

  @Post('/staff/multi')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createDepartmentMultiStaff(
    @Body() staffDto: CreateMultiStaffDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createMultiStaffDepartment(staffDto);
    return new ResponseRequest(res, result, 'Create multi staff success.');
  }

  @Post('/staff')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createDepartmentStaff(
    @Body() staffDto: CreateStaffDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createDepartmentStaff(staffDto);
    return new ResponseRequest(res, result, 'Create staff success.');
  }

  @Put('/staff/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateDepartmentStaff(
    @Param('id') id: string,
    @Body() staffDto: UpdateStaffDepartmentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.updateDepartmentStaff(id, staffDto);
    return new ResponseRequest(res, result, 'Update staff success.');
  }

  @Delete('/staff/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async deleteDepartmentStaff(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    await this.service.deleteDepartmentStaff(id);
    return new ResponseRequest(res, true, 'Delete staff success.');
  }

  @Get()
  async getAllDepartment(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.findAllDepartment();
    return new ResponseRequest(res, result, 'Get department success.');
  }

  @Get('/:id')
  async getDepartmentById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findDepartmentById(id);
    return new ResponseRequest(res, result, 'Get department success.');
  }
}
