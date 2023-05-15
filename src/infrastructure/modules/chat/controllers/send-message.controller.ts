import { SendMessageCommand } from "@application/commands/chat/send-message/send-message.command";
import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { SendMessageRequestDto } from "./dto/send-message.dto";

@Controller("chats/:chat_id")
export class SendMessageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("messages")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  async sendMessage(
    @Req() req: Request,
    @Param("chat_id") chatId: string,
    @Body() body: SendMessageRequestDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { prepareMessageId, message, replyToMessageId } = body;

    const command = new SendMessageCommand({
      metadata: {
        userId: req.userId,
      },
      prepareMessageId,
      chatId,
      message,
      replyToMessageId,
      file: {
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        content: file.buffer,
      },
    });

    let newMessage = null;

    try {
      newMessage = await this.commandBus.execute(command);
    } catch (err) {
      console.log(err);
    }

    if (newMessage) {
      const returnMessage = (
        await this.queryBus.execute(
          new FindMessagesQuery({
            metadata: {
              userId: req.userId,
            },
            chatId: newMessage.chatId.value,
            ids: [newMessage.id.value],
          })
        )
      )[0];

      return returnMessage;
    }

    return;
  }
}
