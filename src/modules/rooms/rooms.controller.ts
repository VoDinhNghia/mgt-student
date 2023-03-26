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
import { ResponseRequest } from 'src/utils/utils.response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateRoomDto } from './dtos/rooms.create.dto';
import { RoomsService } from './rooms.service';
import { Response, Request } from 'express';
import { QueryRoomDto } from './dtos/rooms.query.dto';
import { UpdateRoomDto } from './dtos/rooms.update.dto';
import { Delete } from '@nestjs/common/decorators';
import { msgResponse } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

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
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.roomService.createRoom(createRoomDto, createdBy);
    return new ResponseRequest(res, result, msgResponse.createRoom);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Query() queryRoomDto: QueryRoomDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findAllRooms(queryRoomDto);
    return new ResponseRequest(res, result, msgResponse.getAllRoom);
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
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.roomService.updateRoom(
      id,
      updateRoomDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateRoom);
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
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    const result = await this.roomService.deleteRoom(id, deletedBy);
    return new ResponseRequest(res, result, msgResponse.deleteRoom);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRoomById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.roomService.findRoomById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdRoom);
  }
}
