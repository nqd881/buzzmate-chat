import { LeaveChatCommand } from "@application/commands/chat/leave-chat/leave-chat.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";

@Controller("chats/:chat_id")
export class LeaveChatController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete("members/me")
  @UseGuards(AuthGuard)
  async leaveChat(@Req() req: Request, @Param("chat_id") chatId: string) {
    const command = new LeaveChatCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {}

    return;
  }
}
