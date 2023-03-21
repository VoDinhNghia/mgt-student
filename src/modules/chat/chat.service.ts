import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthenChatService } from './chat.auth-user';

@Injectable()
export class ChatService {
  constructor(private readonly authenChatService: AuthenChatService) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket?.handshake?.headers?.cookie || ''; // check again
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authenChatService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
