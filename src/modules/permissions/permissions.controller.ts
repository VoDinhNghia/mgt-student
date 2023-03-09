import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/response-api';
import { PermissionsService } from './permissions.service';
import { Response } from 'express';
import { CreatePermissionDto } from './dtos/permissions.create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { UpdatePermissionDto } from './dtos/permissions.update.dto';
import { QueryPermissionDto } from './dtos/permissions.query.dto';

@Controller('api/permissions')
@ApiTags('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async createAdminPermission(
    @Body() permissionDto: CreatePermissionDto,
    @Res() res: Response,
  ) {
    const result = await this.service.createAdminPermission(permissionDto);
    return new ResponseRequest(res, result, `Create admin permission success.`);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async updateAdminPermission(
    @Param('id') id: string,
    @Body() permissionDto: UpdatePermissionDto,
    @Res() res: Response,
  ) {
    const result = await this.service.updateAdminPermission(id, permissionDto);
    return new ResponseRequest(res, result, `Update admin permission success.`);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async deleteAdminPermission(@Param('id') id: string, @Res() res: Response) {
    await this.service.deleteAdminPermission(id);
    return new ResponseRequest(res, true, `Delete admin permission success.`);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllAdminPermission(
    @Query() queryDto: QueryPermissionDto,
    @Res() res: Response,
  ) {
    const results = await this.service.findAllAdminPermission(queryDto);
    return new ResponseRequest(res, results, `Get admin permission success.`);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAdminPermissionById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.findAdminPermissionById(id);
    return new ResponseRequest(res, result, `Get admin permission success.`);
  }
}
