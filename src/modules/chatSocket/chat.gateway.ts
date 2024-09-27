import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8800, {
  cors: { origin: 'http://localhost:3000' },
  credentials: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers: { userId: string; socketId: string }[] = [];

  afterInit(server: Server) {
    console.log(`Initialized WebSocket Server ${server}`);
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.activeUsers = this.activeUsers.filter(
      (user) => user.socketId !== socket.id,
    );
    this.server.emit('get-users', this.activeUsers);
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('new-user-add')
  handleNewUserAdd(socket: Socket, newUserId: string) {
    if (!this.activeUsers.some((user) => user.userId === newUserId)) {
      this.activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    console.log('Connected user', this.activeUsers);
    this.server.emit('get-users', this.activeUsers);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    socket: Socket,
    messageData: { receiverId: string; content: any },
  ) {
    const user = this.activeUsers.find(
      (user) => user.userId === messageData.receiverId,
    );
    if (user) {
      this.server.to(user.socketId).emit('receive-message', messageData);
      console.log('Sending message from', socket.id, 'to', user.socketId);
    }
  }
}
