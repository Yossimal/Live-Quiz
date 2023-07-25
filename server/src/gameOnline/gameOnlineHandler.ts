import { Socket } from "socket.io";
import {
    ServerToAdminClientEvents,
    ServerToUserClientEvents,
    AdminClientToServerEvents,
    UserClientToServerEvents,
} from './events';
import { SocketData } from './types'


export default function gameOnlinHandler(socket: Socket<
    AdminClientToServerEvents & UserClientToServerEvents,
    ServerToAdminClientEvents & ServerToUserClientEvents,
    any,
    SocketData>) {
    console.log(`user connected: ${socket}`);
    socket.emit('getGameToken', 'token-noam');

    socket.on('disconnect', (reason) => {
        console.log(`user disconnected: ${reason}, ${socket.id}`);
    });
}
