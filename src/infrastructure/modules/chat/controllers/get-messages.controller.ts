import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { GetMessagesQuery } from "./dto/get-messages.query";

@Controller("chats/:chat_id")
export class GetMessagesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("messages")
  @UseGuards(AuthGuard)
  async findMessages(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Query() queries: GetMessagesQuery
  ) {
    const {
      ids,
      limit,
      before_time,
      after_time,
      before_message_id,
      after_message_id,
    } = queries;

    const query = new FindMessagesQuery({
      metadata: {
        userId: req.userId,
      },
      chatId,
      limit,
      ids: ids,
      beforeTime: before_time,
      afterTime: after_time,
      beforeMessageId: before_message_id,
      afterMessageId: after_message_id,
    });

    try {
      const messages = await this.queryBus.execute(query);

      return messages;
    } catch (err) {
      console.log(err);
    }
  }
}
