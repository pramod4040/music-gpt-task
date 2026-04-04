import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '../auth/interfaces/jwt-user-payload.interface';
import { GatewayService } from './gateway.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class PromptGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PromptGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly gatewayService: GatewayService,
  ) {}

  afterInit(server: Server) {
    this.gatewayService.setServer(server);
  }

  handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.headers.token as string
      if (!token) {
        socket.disconnect()
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET_KEY') || 'your-secret-key';
      const payload = jwt.verify(token, secret) as JwtUserPayload;

      socket.data.userId = payload.id;
      socket.join(`user:${payload.id}`);
      this.logger.log(`Connected: user=${payload.id} socket=${socket.id}`);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Disconnected: user=${socket.data.userId} socket=${socket.id}`);
  }
}
