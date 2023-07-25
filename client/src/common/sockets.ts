import { io, Socket } from "socket.io-client";
import {
    AdminClientToServerEvents,
    ServerToAdminClientEvents,
    ServerToUserClientEvents,
    UserClientToServerEvents
} from '../types/eventsTypes'

export const adimnSocket: Socket<ServerToAdminClientEvents, AdminClientToServerEvents>
    = io('http://localhost:3000', {
        autoConnect: false
    });

export const userSocket: Socket<ServerToUserClientEvents, UserClientToServerEvents>
    = io('http://localhost:3000', {
        autoConnect: false
    });
