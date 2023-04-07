import { JsonTransformPipe } from "@infrastructure/ws-pipes/json-transform";
import { Inject, UseGuards, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { IsOptional, IsString } from "class-validator";
import { Server, Socket } from "socket.io";
import { SendMessageRequestDto } from "../controllers/dto/send-message.dto";
import { SendMessageCommand } from "@application/commands/chat/send-message/send-message.command";
import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { WsAuthGuard } from "@infrastructure/ws-guards/ws-auth-guard";
import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainEventBusService } from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import { MessageCreatedDomainEvent } from "@domain/models/message/events/message-created";

export class SendMessageData {
  @IsString()
  @IsOptional()
  prepareMessageId: string;

  // @IsString()
  // @IsOptional()
  // matchId: string;

  @IsString()
  chatId: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  replyToMessageId: string;
}

@WebSocketGateway(4001)
export class SendMessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private domainEventBusService: DomainEventBusService
  ) {}

  @SubscribeMessage("send_message")
  @UseGuards(WsAuthGuard)
  async handleSendMessage(
    @MessageBody()
    data: SendMessageData,
    @ConnectedSocket() socket: Socket
  ) {
    const { prepareMessageId, chatId, message, replyToMessageId } = data;

    const command = new SendMessageCommand({
      metadata: {
        userId: socket.userId,
      },
      prepareMessageId,
      chatId,
      message,
      replyToMessageId,
    });

    await this.commandBus.execute(command);
  }
}
