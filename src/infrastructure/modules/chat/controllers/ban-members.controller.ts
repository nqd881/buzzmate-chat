import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import { BanMembersRequestDto } from "./dto/ban-members.dto";
import { BanMembersCommand } from "@application/commands/chat/ban-members/ban-members.command";

@Controller("chats/:chat_id")
export class BanMembersController {
  constructor(private commandBus: CommandBus) {}

  @Post("members/ban")
  async banMembers(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: BanMembersRequestDto
  ) {
    const { memberIds, reason } = body;

    const command = new BanMembersCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      memberIds,
      reason,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    return;
  }
}
