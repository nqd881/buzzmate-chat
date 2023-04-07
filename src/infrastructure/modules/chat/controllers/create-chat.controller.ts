import { CreateChatCommand } from "@application/commands/chat/create-chat/create-chat.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { CreateChatRequestDto } from "./dto/create-chat.dto";
import { Chat } from "@domain/models/chat/chat";
import { FindChatsQuery } from "@application/queries/find-chats/find-chats.query";

@Controller("chats")
export class CreateChatController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createChat(@Req() req: Request, @Body() body: CreateChatRequestDto) {
    const { title, description, memberUserIds } = body;

    const command = new CreateChatCommand({
      metadata: {
        userId: req.userId,
      },
      title,
      description,
      memberUserIds,
    });

    let newChat: Chat;

    try {
      newChat = await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    if (newChat) {
      const query = new FindChatsQuery({
        metadata: {
          userId: req.userId,
        },
        byIds: [newChat.id.value],
      });

      const returnChat = (await this.queryBus.execute(query))[0];

      return returnChat;
    }

    return;
  }
}
