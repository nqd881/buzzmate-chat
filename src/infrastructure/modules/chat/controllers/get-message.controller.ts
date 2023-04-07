import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";

@Controller("chats/:chat_id")
export class GetMessageController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("messages/:message_id")
  @UseGuards(AuthGuard)
  async findMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string
  ) {
    const query = new FindMessagesQuery({
      metadata: {
        userId: req.userId,
      },
      chatId,
      ids: [messageId],
    });

    try {
      const messages = await this.queryBus.execute(query);

      return messages?.[0] ?? null;
    } catch (err) {
      console.log(err);
    }
  }
}
