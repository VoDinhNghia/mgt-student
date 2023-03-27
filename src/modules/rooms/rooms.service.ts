import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { msgNotFound } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { skipLimitAndSortPagination } from 'src/utils/utils.page.pagination';
import { ValidateDto } from 'src/validates/validates.common.dto';
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
    const option = { name: name?.trim() };
    await new ValidateDto().existedByOptions(collections.rooms, option, 'Room');
    const dto = {
      ...roomDto,
      createdBy,
    };
    const result = await new this.roomSchema(dto).save();
    return result;
  }

  async findRoomById(id: string): Promise<Rooms> {
    const result = await this.roomSchema.findById(id);
    if (!result) {
      new CommonException(404, msgNotFound);
    }
    return result;
  }

  async findAllRooms(
    queryRoomDto: QueryRoomDto,
  ): Promise<{ data: Rooms[]; countTotal: number }> {
    const { limit, page, searchKey, type } = queryRoomDto;
    const match: ImatchFindRoom = { $match: { isDeleted: false } };
    if (searchKey) {
      match.$match.name = RegExp(searchKey);
    }
    if (type) {
      match.$match.type = type;
    }
    const aggregate = skipLimitAndSortPagination(limit, page);
    const rooms = await this.roomSchema.aggregate([match, ...aggregate]);
    const countDocuments = await this.roomSchema.countDocuments();
    const results = {
      data: rooms,
      countTotal: countDocuments ?? 0,
    };
    return results;
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
