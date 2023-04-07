import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient<Socket>();

    if (socket.userId) return true;

    return false;
  }
}
