import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './rooms.create.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
