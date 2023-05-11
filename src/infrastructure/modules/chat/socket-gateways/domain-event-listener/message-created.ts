import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { MessageCreatedDomainEvent } from "@domain/models/message/events/message-created";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import { QueryBus } from "@nestjs/cqrs";
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(4001, { cors: true })
export class MessageCreatedSocketListener implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private queryBus: QueryBus,
    private domainEventBusService: DomainEventBusService
  ) {}

  afterInit(server: Server) {
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
