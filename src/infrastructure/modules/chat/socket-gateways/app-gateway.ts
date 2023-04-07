import { FindChatsQuery } from "@application/queries/find-chats/find-chats.query";
import { ChatResponseDto } from "@application/query-repo/response-dto";
import { WsAuthGuard } from "@infrastructure/ws-guards/ws-auth-guard";
import { Inject, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import cookieParser from "cookie-parser";
import { Server, Socket } from "socket.io";

import cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import { DomainEventName } from "@domain/utils/domain-event-name";
import { MessageCreatedDomainEvent } from "@domain/models/message/events/message-created";
import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { FindUserByIdentityCommand } from "@application/commands/user/find-user-by-identity/find-user-by-identity.command";

@WebSocketGateway(4001, { cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayInit {
  private PRIVATE_KEY: Buffer = null;

  @WebSocketServer()
  server: Server;

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private domainEventBusService: DomainEventBusService
  ) {
    this.PRIVATE_KEY = fs.readFileSync(
      "src/infrastructure/env/jwt-keys/public.key"
    );
  }

  private async findChatsOfUser(userId: string) {
    const query = new FindChatsQuery({
      metadata: {
        userId,
      },
    });

    return this.queryBus.execute<FindChatsQuery, ChatResponseDto[]>(query);
  }

  private async checkUser(socket: Socket) {
    const accessToken = socket.handshake.auth?.accessToken;

    try {
      const payload = jwt.verify(accessToken, this.PRIVATE_KEY) as JwtPayload;

      const { rootUserId } = payload;

      if (rootUserId) {
        const command = new FindUserByIdentityCommand({
          identity: rootUserId,
        });

        const user = await this.commandBus.execute(command);

        if (user) {
          socket.userId = user.id.value;
        }
      }
    } catch (err) {}
  }

  private async joinChats(socket: Socket) {
    if (!socket?.userId) return;

    const chats = await this.findChatsOfUser(socket.userId);

    const chatIds = chats.map((chat) => chat.id);

    socket.join(chatIds);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    await this.checkUser(socket);

    await this.joinChats(socket);
  }

  async afterInit(server: Server) {
    this.domainEventBusService.registerDynamicHandler(
      MessageCreatedDomainEvent,
      async (event: MessageCreatedDomainEvent) => {
        const { messageId, chatId, senderUserId } = event;
        const returnMessage = (
          await this.queryBus.execute(
            new FindMessagesQuery({
              metadata: {
                userId: senderUserId.value,
              },
              chatId: chatId.value,
              ids: [messageId.value],
            })
          )
        )[0];

        server.to(chatId.value).emit("message_created", returnMessage);
      }
    );
  }
}
