import { MemberCreatedDomainEvent } from "@domain/models/member/events/member-created";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(4001, { cors: true })
export class MemberCreatedSocketListener implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private domainEventBusService: DomainEventBusService) {}

  afterInit(server: Server) {
    this.domainEventBusService.registerDynamicHandler(
      MemberCreatedDomainEvent,
      async (event: MemberCreatedDomainEvent) => {
        const { chatId, userId } = event;

        server.to(userId.value).emit("join_new_chat", chatId.value);

        server.in(userId.value).socketsJoin(chatId.value);
      }
    );
  }
}
