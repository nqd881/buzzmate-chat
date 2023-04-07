import { EditChatInfoCommand } from "@application/commands/chat/edit-chat-info/edit-chat-info.command";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Body, Controller, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import { EditChatInfoRequestDto } from "./dto/edit-chat-info.dto";

@Controller("chats")
@UseGuards(AuthGuard)
export class EditChatInfoController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(":chat_id")
  @UseGuards(AuthGuard)
  async changeChatInfo(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: EditChatInfoRequestDto
  ) {
    const { title, description } = body;

    const command = new EditChatInfoCommand({
      metadata: {
        userId: req.userId,
      },
      chatId,
      title,
      description,
    });

    try {
      await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }
    // return result;
  }
}
