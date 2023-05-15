import { Ports } from "@application/ports/constants";
import { FindMessagesQuery } from "@application/queries/find-messages/find-messages.query";
import { IMessageQueryModel } from "@application/query-repo/query-model";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { FileRetrievalService } from "@infrastructure/modules/extra-modules/file-retrieval/file-retrieval.service";
import {
  Controller,
  Get,
  Inject,
  Param,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request, Response } from "express";

@Controller("chats/:chat_id")
export class GetMessageFileController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Ports.FileRetrievalService)
    private fileRetrievalService: FileRetrievalService
  ) {}

  @Get("messages/:message_id/file")
  @UseGuards(AuthGuard)
  async getMessageFile(
    @Req() req: Request,
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("message_id") messageId: string
  ) {
    const query = new FindMessagesQuery({
      metadata: {
        userId: req.userId,
      },
      chatId,
      ids: [messageId],
    });

    try {
      const messages = await this.queryBus.execute<
        FindMessagesQuery,
        IMessageQueryModel[]
      >(query);

      const message = messages?.[0];

      if (!message) res.end();

      const readStream = this.fileRetrievalService.createMessageFileReadStream(
        chatId,
        messageId
      );

      readStream.on("error", () => {
        console.log("Read stream file error");
      });

      readStream.pipe(res);
    } catch (err) {
      console.log("Get Photo controller", err);
    }
  }
}
