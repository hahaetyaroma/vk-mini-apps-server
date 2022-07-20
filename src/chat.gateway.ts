import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, client: Socket): void {
    this.server.emit('message', message);
  }
  afterInit(server: Server) {
    this.logger.log(server);
  }
  numberOfConnection: number;
  async handleDisconnect(client: Socket) {
    this.numberOfConnection = (await this.server.allSockets()).size;
    console.log(this.numberOfConnection);
    return this.numberOfConnection;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.numberOfConnection = (await this.server.allSockets()).size;
    console.log(this.numberOfConnection);
    return this.numberOfConnection;
  }
}
