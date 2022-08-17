import { Interval } from '@nestjs/schedule';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway {
    @WebSocketServer()
    server: Server;

    // @Interval(10000)
    @SubscribeMessage('health_check')
    healthCheck(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): void {
        client.emit('health_response', {
            status: true,
            datetime: new Date(),
        });
    }
}
