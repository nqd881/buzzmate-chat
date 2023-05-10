import { Ports } from "@application/ports/constants";
import { ChatFilePath } from "@application/ports/interface/file-storage";
import { FindChatDocumentsQuery } from "@application/queries/find-chat-documents/find-chat-documents.query";
import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { FileStorageService } from "@infrastructure/modules/extra-modules/file-storage/file-storage.service";
import { Controller, Get, Inject, Param, Res, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("chats/:chat_id/documents")
export class GetChatDocumentController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Ports.FileStorageService)
    private fileStorageService: FileStorageService
  ) {}

  @Get(":document_id")
  @UseGuards(AuthGuard)
  async getChatDocument(
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("document_id") documentId: string
  ) {
    const query = new FindChatDocumentsQuery({
      chatId,
      byIds: [documentId],
    });

    try {
      const result = await this.queryBus.execute(query);

      const document = result?.[0];

      if (!document) return;

      const readStream = this.fileStorageService.getChatFileReadStream(
        new ChatFilePath(new ChatId(chatId), new FileId(document.file.id))
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
