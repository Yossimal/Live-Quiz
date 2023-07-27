import { io, Socket } from "socket.io-client";
import {
    AdminClientToServerEvents,
    ServerToAdminClientEvents,
    ServerToUserClientEvents,
    UserClientToServerEvents
} from '../types/eventsTypes'
import { SERVER_URL } from "./consts";

export const adimnSocket: Socket<ServerToAdminClientEvents, AdminClientToServerEvents>
    = io(SERVER_URL, {
        autoConnect: false
    });

export const userSocket: Socket<ServerToUserClientEvents, UserClientToServerEvents>
    = io(SERVER_URL, {
        autoConnect: false
    });
