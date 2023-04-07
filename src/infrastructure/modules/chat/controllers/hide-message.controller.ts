import { HideMessagesCommand } from "@application/commands/chat/hide-messages/hide-messages.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import { HideMessagesRequestDto } from "./dto/hide-messages.dto";

@Controller("chat/:chat_id")
export class HideMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch("messages/:message_id/hide")
  @UseGuards(AuthGuard)
  async hideMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string
  ) {
    const command = new HideMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      messageIds: [messageId],
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }

  @Patch("messages/hide")
  @UseGuards(AuthGuard)
  async hideMessages(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: HideMessagesRequestDto
  ) {
    const { messageIds } = body;

    const command = new HideMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      messageIds,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
