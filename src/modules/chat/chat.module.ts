import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenChatService } from './chat.auth-user';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, ChatGateway, AuthenChatService, JwtService],
})
export class ChatModule {}
