import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { roomMsg } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateRoomDto } from './dtos/rooms.create.dto';
import { QueryRoomDto } from './dtos/rooms.query.dto';
import { UpdateRoomDto } from './dtos/rooms.update.dto';
import { ImatchFindRoom } from './interfaces/rooms.find.match.interface';
import { Rooms, RoomsDocument } from './schemas/rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
  ) {}

  async createRoom(roomDto: CreateRoomDto, createdBy: string): Promise<Rooms> {
    const { name } = roomDto;
    const option = { name: name?.trim(), isDeleted: false };
    const existedName = await this.roomSchema.findOne(option);
    if (existedName) {
      new CommonException(409, roomMsg.existedName);
    }
    const createRoomDto = {
      ...roomDto,
      createdBy,
    };
    const result = await new this.roomSchema(createRoomDto).save();
    return result;
  }

  async findRoomById(id: string): Promise<Rooms> {
    const result = await this.roomSchema.findById(id);
    if (!result) {
      new CommonException(404, roomMsg.notFound);
    }
    return result;
  }

  async findAllRooms(
    queryRoomDto: QueryRoomDto,
  ): Promise<{ results: Rooms[]; total: number }> {
    const { limit, page, searchKey, type } = queryRoomDto;
    const query: ImatchFindRoom = { isDeleted: false };
    if (searchKey) {
      query.name = RegExp(searchKey, 'i');
    }
    if (type) {
      query.type = type;
    }
    const rooms = await this.roomSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .exec();
    const total = await this.roomSchema.find(query).count();
    const data = {
      results: rooms,
      total,
    };
    return data;
  }

  async updateRoom(
    id: string,
    updateDto: UpdateRoomDto,
    updatedBy: string,
  ): Promise<Rooms> {
    await this.findRoomById(id);
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.roomSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async deleteRoom(id: string, deletedBy: string): Promise<void> {
    await this.findRoomById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.roomSchema.findByIdAndUpdate(id, dto);
  }
}
