import { JoinChatCommand } from "@application/commands/chat/join-chat/join-chat.command";
import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { JoinChatRequestDto } from "./dto/join-chat.dto";
import { CommandBus } from "@nestjs/cqrs";

@Controller("chats/:chat_id")
export class JoinChatController {
  constructor(private commandBus: CommandBus) {}

  @Post("join")
  async joinChat(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: JoinChatRequestDto
  ) {
    const { key } = body;

    const command = new JoinChatCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      key,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
