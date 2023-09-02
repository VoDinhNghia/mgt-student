import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { PermissionsService } from './permissions.service';
import { Response, Request } from 'express';
import { CreatePermissionDto } from './dtos/permissions.create.dto';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { UpdatePermissionDto } from './dtos/permissions.update.dto';
import { QueryPermissionDto } from './dtos/permissions.query.dto';
import { permissionMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { permissionController } from 'src/constants/constants.controller.name-tag';

@Controller(permissionController.name)
@ApiTags(permissionController.tag)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  public async createAdminPermission(
    @Body() permissionDto: CreatePermissionDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createAdminPermission(
      permissionDto,
      profileId,
    );

    return new ResponseRequest(res, result, permissionMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  public async updateAdminPermission(
    @Param('id') id: string,
    @Body() permissionDto: UpdatePermissionDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateAdminPermission(
      id,
      permissionDto,
      profileId,
    );

    return new ResponseRequest(res, result, permissionMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  public async deleteAdminPermission(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteAdminPermission(id, profileId);

    return new ResponseRequest(res, true, permissionMsg.delete);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getAllAdminPermission(
    @Query() queryDto: QueryPermissionDto,
    @Res() res: Response,
  ) {
    const results = await this.service.findAllAdminPermissions(queryDto);

    return new ResponseRequest(res, results, permissionMsg.getAll);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getAdminPermissionById(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result = await this.service.findAdminPermissionById(id);

    return new ResponseRequest(res, result, permissionMsg.getById);
  }
}
