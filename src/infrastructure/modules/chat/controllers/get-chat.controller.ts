import { FindChatsQuery } from "@application/queries/find-chats/find-chats.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";

@Controller("chats")
export class GetChatController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(":chat_id")
  @UseGuards(AuthGuard)
  async getChat(@Req() req: Request, @Param("chat_id") chatId: string) {
    const query = new FindChatsQuery({
      metadata: {
        userId: req.userId,
      },
      byIds: [chatId],
      limit: 1,
    });

    try {
      const chats = await this.queryBus.execute(query);

      return chats?.[0] ?? null;
    } catch (err) {
      console.log(err);
    }
  }
}
