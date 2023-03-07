import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateRoomDto } from './dtos/rooms.create.dto';
import { QueryRoomDto } from './dtos/rooms.query.dto';
import { UpdateRoomDto } from './dtos/rooms.update.dto';
import { Rooms, RoomsDocument } from './schemas/rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Rooms> {
    const result = await new this.roomSchema(createRoomDto).save();
    return result;
  }

  async findRoomById(id: string): Promise<Rooms> {
    const result = await this.roomSchema.findById(id);
    if (!result) {
      new CommonException(404, `Room not found.`);
    }
    return result;
  }

  async findAllRooms(
    queryRoomDto: QueryRoomDto,
  ): Promise<{ data: Rooms[]; countTotal: number }> {
    const { limit, page, searchKey, type } = queryRoomDto;
    const query: Record<string, any> = {};
    if (searchKey) {
      query.name = RegExp(searchKey);
    }
    if (type) {
      query.type = type;
    }
    const result = await this.roomSchema
      .find(query)
      .skip(Number(limit) * Number(page) - Number(limit))
      .limit(Number(limit))
      .exec();
    const countDocuments = await this.roomSchema.countDocuments();
    return {
      data: result,
      countTotal: countDocuments ?? 0,
    };
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto): Promise<void> {
    await this.findRoomById(id);
    await this.roomSchema.findByIdAndUpdate(id, updateRoomDto);
  }

  async deleteRoom(id: string): Promise<void> {
    await this.findRoomById(id);
    await this.roomSchema.findByIdAndDelete(id);
  }
}
