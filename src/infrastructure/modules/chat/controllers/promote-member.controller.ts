import { PromoteMemberCommand } from "@application/commands/chat/promote-member/promote-member.command";
import { Controller, Param, Patch, Req } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";

@Controller("chats/:chat_id")
export class PromoteMemberController {
  constructor(private commandBus: CommandBus) {}

  @Patch("members/:member_id/promote")
  async promote(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Param("member_id") memberId: string
  ) {
    const command = new PromoteMemberCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      memberId,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
