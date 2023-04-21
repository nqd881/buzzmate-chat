import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { ForwardMessageRequestDto } from "./dto/forward-messages.dto";
import { ForwardMessageCommand } from "@application/commands/chat/foward-message/forward-message.command";
import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";

@Controller("chats/:chat_id")
export class ForwardMessageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("messages/:message_id/forward")
  @UseGuards(AuthGuard)
  async forwardMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string,
    @Body() body: ForwardMessageRequestDto
  ) {
    const { toChatId } = body;

    const command = new ForwardMessageCommand({
      metadata: {
        userId: req.userId,
      },
      fromChatId: chatId,
      toChatId,
      messageId,
    });

    let newMessage = null;

    try {
      newMessage = await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    if (newMessage) {
      const returnMessage = (
        await this.queryBus.execute(
          new FindMessagesQuery({
            metadata: {
              userId: req.userId,
            },
            chatId: newMessage.chatId.value,
            ids: [newMessage.id.value],
          })
        )
      )[0];

      return returnMessage;
    }

    return;
  }
}
