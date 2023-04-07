import { FindChatsQuery } from "@application/queries/find-chats/find-chats.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { GetChatsQuery } from "./dto/get-chats.query";

@Controller("chats")
export class GetChatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllChats(@Req() req: Request, @Query() queries: GetChatsQuery) {
    const { ids, limit } = queries;

    const query = new FindChatsQuery({
      metadata: {
        userId: req.userId,
      },
      byIds: ids,
      limit,
    });

    try {
      const chats = await this.queryBus.execute(query);

      return chats;
    } catch (err) {
      console.log(err);
    }
  }
}
