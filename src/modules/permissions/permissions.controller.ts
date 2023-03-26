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
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

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
    @Req() req: Request,
  ) {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createAdminPermission(
      permissionDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createPermission);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async updateAdminPermission(
    @Param('id') id: string,
    @Body() permissionDto: UpdatePermissionDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateAdminPermission(
      id,
      permissionDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updatePermission);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async deleteAdminPermission(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteAdminPermission(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deletePermission);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllAdminPermission(
    @Query() queryDto: QueryPermissionDto,
    @Res() res: Response,
  ) {
    const results = await this.service.findAllAdminPermissions(queryDto);
    return new ResponseRequest(res, results, msgResponse.getAllPermission);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAdminPermissionById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.findAdminPermissionById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdPermission);
  }
}
