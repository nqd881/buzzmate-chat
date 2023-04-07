import { PinMessagesCommand } from "@application/commands/chat/pin-messages/pin-messages.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import {
  PinMessageRequestDto,
  PinMessagesRequestDto,
} from "./dto/pin-messages.dto";

@Controller("chats/:chat_id")
export class PinMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("messages/pin")
  @UseGuards(AuthGuard)
  async pinMessages(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: PinMessagesRequestDto
  ) {
    const { messageIds, shouldPin } = body;

    const command = new PinMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      messageIds,
      shouldPin,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }

  @Patch("messages/:message_id/pin")
  @UseGuards(AuthGuard)
  async pinMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string,
    @Body() body: PinMessageRequestDto
  ) {
    const { shouldPin } = body;

    const command = new PinMessagesCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      messageIds: [messageId],
      shouldPin,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
