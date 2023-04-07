import { SendReactionCommand } from "@application/commands/chat/send-reaction/send-reaction.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import { SendReactionRequestDto } from "./dto/send-reaction.dto";

@Controller("chat/:chat_id")
export class SendReactionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("messages/:message_id/reactions")
  @UseGuards(AuthGuard)
  async newReaction(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string,
    @Body() body: SendReactionRequestDto
  ) {
    const { reactionValue } = body;

    const command = new SendReactionCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      messageId,
      reactionValue,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
