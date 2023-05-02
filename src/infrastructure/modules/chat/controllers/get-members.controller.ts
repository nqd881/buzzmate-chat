import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { GetMembersQuery } from "./dto/get-members.query";
import { FindMembersQuery } from "@application/queries/find-members/find-members.query";

@Controller("chats/:chat_id")
export class GetMembersController {
  constructor(private queryBus: QueryBus) {}

  @Get("members")
  @UseGuards(AuthGuard)
  async getMembers(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Query() queries: GetMembersQuery
  ) {
    const { ids, limit } = queries;

    const query = new FindMembersQuery({
      metadata: {
        userId: req.userId,
      },
      chatId,
      limit,
      byIds: ids,
    });

    try {
      const messages = await this.queryBus.execute(query);

      return messages;
    } catch (err) {
      console.log(err);
    }
  }
}
