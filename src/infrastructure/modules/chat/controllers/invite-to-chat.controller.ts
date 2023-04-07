import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { InviteToChatRequestDto } from "./dto/invite-to-chat.dto";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { InviteToChatCommand } from "@application/commands/chat/invite-to-chat/invite-to-chat.command";
import { Request } from "express";
import { CommandBus } from "@nestjs/cqrs";

@Controller("invitations")
export class InviteToChatController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard)
  async invite(@Req() req: Request, @Body() body: InviteToChatRequestDto) {
    const { chatId, userIds } = body;

    const command = new InviteToChatCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      invitedUserIds: userIds,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
