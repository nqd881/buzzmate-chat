import { Ports } from "@application/ports/constants";
import { FindDocumentsQuery } from "@application/queries/find-documents/find-documents.query";
import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { FileStorageService } from "@infrastructure/modules/extra-modules/file-storage/file-storage.service";
import { Controller, Get, Inject, Param, Res, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("chats/:chat_id/documents")
export class GetDocumentController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Ports.FileStorageService)
    private fileStorageService: FileStorageService
  ) {}

  @Get(":document_id")
  @UseGuards(AuthGuard)
  async getPhoto(
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("document_id") documentId: string
  ) {
    const query = new FindDocumentsQuery({
      chatId,
      byIds: [documentId],
    });

    try {
      const result = await this.queryBus.execute(query);

      const video = result?.[0];

      if (!video) return;

      const readStream = this.fileStorageService.getChatFileReadStream(
        new ChatId(chatId),
        new FileId(video.file.id)
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
