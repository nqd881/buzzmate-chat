import { Ports } from "@application/ports/constants";
import { FindVideosQuery } from "@application/queries/find-videos/find-videos.query";
import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";
import { FileStorageService } from "@infrastructure/modules/extra-modules/file-storage/file-storage.service";
import { Controller, Get, Inject, Param, Res } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("chats/:chat_id")
export class GetVideoController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Ports.FileStorageService)
    private fileStorageService: FileStorageService
  ) {}

  @Get("videos/:video_id")
  async getPhoto(
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("video_id") videoId: string
  ) {
    const query = new FindVideosQuery({
      chatId,
      byIds: [videoId],
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
