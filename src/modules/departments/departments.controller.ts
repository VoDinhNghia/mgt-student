import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/responseApi';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { DepartmentsService } from './departments.service';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
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
}
