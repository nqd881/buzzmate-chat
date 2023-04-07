import { ForwardMessagesCommand } from "@application/commands/chat/foward-messages/forward-messages.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import {
  ForwardMessageRequestDto,
  ForwardMessagesRequestDto,
} from "./dto/forward-messages.dto";

@Controller("chats/:chat_id")
export class ForwardMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("messages/:message_id/forward")
  @UseGuards(AuthGuard)
  async forwardMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string,
    @Body() body: ForwardMessageRequestDto
  ) {
    const { toChatId } = body;

    const command = new ForwardMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      fromChatId: chatId,
      toChatId,
      messageIds: [messageId],
    });

    const message = (await this.commandBus.execute(command))[0];

    return message;
  }

  @Post("messages/forward")
  @UseGuards(AuthGuard)
  async forwardMessages(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: ForwardMessagesRequestDto
  ) {
    const { toChatId, messageIds } = body;

    const command = new ForwardMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      fromChatId: chatId,
      toChatId,
      messageIds,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }
  }
}
