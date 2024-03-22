import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// 개발 중에 서버에서 CORS를 활성화해야 합니다.
@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  // 웹소켓이 클라이언트에서 socket.connect() 함수를 실행하면, 본함수가 실행된다.
  // 정상적으로 소켓 연결이 완료되면 클라이언트로 onConnect 함수를 emit 한다.
  // 함수구현 소켓이 연결되고, 유저 아이디가 존재할경우 소켓+유저아이디를 저장한다.
  handleConnection(socket: Socket): any {
    console.log('handleConnection - socket connect', socket.id);
    socket.emit('connected', {
      message: 'ok',
      id: socket.id,
    });
    return true;
  }

  // 클라이언트에서 웹소켓 연결이 끊어지면 socket.disconnect() 함수가  실행된다.
  // 소켓 연결이 끊어지면, 클라이언트로 onDisconnect 를 emit한다.
  handleDisconnect(socket: Socket): any {
    console.log('handleDisconnect - socket disconnect');
    socket.emit('disconnected', {
      message: 'ok',
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    console.log(data);
    socket.emit('message', data);
  }
}
