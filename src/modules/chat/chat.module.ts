import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/guards/auth.jwt-strategy.guard';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, ChatGateway, JwtStrategy, JwtService],
})
export class ChatModule {}
