import {
  Body,
  Controller,
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
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { CreateRoomDto } from './dtos/rooms.create.dto';
import { RoomsService } from './rooms.service';
import { Response, Request } from 'express';
import { QueryRoomDto } from './dtos/rooms.query.dto';
import { UpdateRoomDto } from './dtos/rooms.update.dto';
import { Delete } from '@nestjs/common/decorators';

@Controller('api/rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.roomService.createRoom(createRoomDto, createdBy);
    return new ResponseRequest(res, result, 'Create room success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Query() queryRoomDto: QueryRoomDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findAllRooms(queryRoomDto);
    return new ResponseRequest(res, result, 'Get all room success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.roomService.updateRoom(
      id,
      updateRoomDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, 'Update room success');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async deleteRoom(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profileId;
    const result = await this.roomService.deleteRoom(id, deletedBy);
    return new ResponseRequest(res, result, 'Delete room success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRoomById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findRoomById(id);
    return new ResponseRequest(res, result, 'Get room success');
  }
}
