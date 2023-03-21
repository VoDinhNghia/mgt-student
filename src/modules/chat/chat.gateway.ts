import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const authorization = socket?.handshake?.headers?.authorization || '';
    if (authorization) {
      const author = await this.chatService.getUserFromSocket(authorization);
      console.log('author', author);
      this.server.sockets.emit('receive_message', {
        content,
        author,
      });
    }
  }

  async handleConnection(socket: Socket) {
    const authorization = socket?.handshake?.headers?.authorization || '';
    console.log('token', authorization);
    if (authorization) {
      await this.chatService.getUserFromSocket(authorization);
    }
  }
}
