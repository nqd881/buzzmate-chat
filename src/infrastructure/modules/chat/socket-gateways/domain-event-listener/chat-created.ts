import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { ChatCreatedDomainEvent } from "@domain/models/chat/events/chat-created";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import { QueryBus } from "@nestjs/cqrs";
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(4001, { cors: true })
export class ChatCreatedSocketListener implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private queryBus: QueryBus,
    private domainEventBusService: DomainEventBusService
  ) {}

  afterInit(server: Server) {
    this.domainEventBusService.registerDynamicHandler(
      ChatCreatedDomainEvent,
      async (event: ChatCreatedDomainEvent) => {
        const { chatId, title } = event;

        console.log("New chat created: ", chatId);

        // const { messageId, chatId, senderUserId } = event;
        // const returnMessage = (
        //   await this.queryBus.execute(
        //     new FindMessagesQuery({
        //       metadata: {
        //         userId: senderUserId.value,
        //       },
        //       chatId: chatId.value,
        //       ids: [messageId.value],
        //     })
        //   )
        // )[0];

        server.to(chatId.value).emit("signal_chat_created");
      }
    );
  }
}
