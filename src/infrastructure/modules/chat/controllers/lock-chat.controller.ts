import { LockChatCommand } from "@application/commands/chat/lock-chat/lock-chat.command";
import { Controller, Delete, Param, Req } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";

@Controller("chats/:chat_id")
export class LockChatController {
  constructor(private commandBus: CommandBus) {}

  @Delete()
  async lock(@Req() req: Request, @Param("chat_id") chatId: string) {
    const command = new LockChatCommand({
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
