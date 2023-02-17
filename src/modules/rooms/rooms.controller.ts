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
import { ResponseRequest } from 'src/abstracts/responseApi';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateRoomDto } from './dtos/rooms.create.dto';
import { RoomsService } from './rooms.service';
import { Response } from 'express';
import { QueryRoomDto } from './dtos/rooms.query.dto';
import { UpdateRoomDto } from './dtos/rooms.update.dto';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.createRoom(createRoomDto);
    return new ResponseRequest(res, result, 'Create room success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async getRooms(
    @Query() queryRoomDto: QueryRoomDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findAllRooms(queryRoomDto);
    return new ResponseRequest(res, result, 'Get all room success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async getRoomById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findRoomById(id);
    return new ResponseRequest(res, result, 'Get room success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.updateRoom(id, updateRoomDto);
    return new ResponseRequest(res, result, 'Update room success');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async deleteRoom(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.deleteRoom(id);
    return new ResponseRequest(res, result, 'Delete room success');
  }
}
