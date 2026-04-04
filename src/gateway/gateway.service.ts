import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GatewayService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server?.to(`user:${userId}`).emit(event, data);
  }
}
