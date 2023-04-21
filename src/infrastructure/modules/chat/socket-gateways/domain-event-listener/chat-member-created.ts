import { ChatMemberCreatedDomainEvent } from "@domain/models/chat-member/events/chat-member-created";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(4001, { cors: true })
export class ChatMemberCreatedSocketListener implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private domainEventBusService: DomainEventBusService) {}

  afterInit(server: Server) {
    this.domainEventBusService.registerDynamicHandler(
      ChatMemberCreatedDomainEvent,
      async (event: ChatMemberCreatedDomainEvent) => {
        const { chatId, userId } = event;

        server.to(userId.value).emit("join_new_chat", chatId.value);

        server.in(userId.value).socketsJoin(chatId.value);
      }
    );
  }
}
