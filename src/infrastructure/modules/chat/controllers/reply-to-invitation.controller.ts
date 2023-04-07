import { ReplyToInvitationCommand } from "@application/commands/chat/reply-to-invitation/reply-to-invitation.command";
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import { ReplyToInvitationRequestDto } from "./dto/reply-to-invitation.dto";
import { AuthGuard } from "@infrastructure/guards/auth.guard";

@Controller("invitations")
export class ReplyToInvitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(":invitation_id/response")
  @UseGuards(AuthGuard)
  async reply(
    @Req() req: Request,
    @Param("invitation_id") invitationId: string,
    @Body() body: ReplyToInvitationRequestDto
  ) {
    const { accept } = body;

    const command = new ReplyToInvitationCommand({
      metadata: {
        userId: req.userId,
      },
      invitationId,
      accept,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
