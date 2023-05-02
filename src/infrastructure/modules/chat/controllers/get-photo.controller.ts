import { Ports } from "@application/ports/constants";
import { FindPhotosQuery } from "@application/queries/find-photos/find-photos.query";
import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";
import { FileStorageService } from "@infrastructure/modules/extra-modules/file-storage/file-storage.service";
import { Controller, Get, Inject, Param, Res } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("chats/:chat_id")
export class GetPhotoController {
  constructor(
    @Inject(Ports.FileStorageService)
    private fileStorageService: FileStorageService,
    private readonly queryBus: QueryBus
  ) {}

  @Get("photos/:photo_id")
  async getPhoto(
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("photo_id") photoId: string
  ) {
    const query = new FindPhotosQuery({
      byIds: [photoId],
    });

    try {
      const result = await this.queryBus.execute(query);

      const photo = result?.[0];

      if (!photo) return;

      const readStream = this.fileStorageService.getChatFileReadStream(
        new ChatId(chatId),
        new FileId(photo.file.id)
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
