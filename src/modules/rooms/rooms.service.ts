import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dtos/rooms.create.dto';
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
}
