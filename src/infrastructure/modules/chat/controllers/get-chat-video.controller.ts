import { Ports } from "@application/ports/constants";
import { FindChatVideosQuery } from "@application/queries/find-chat-videos/find-chat-videos.query";
import { VideoQueryModel } from "@application/query-repo/query-model";
import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";
import { FileStorageService } from "@infrastructure/modules/extra-modules/file-storage/file-storage.service";
import {
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Req,
  Res,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request, Response } from "express";

@Controller("chats/:chat_id")
export class GetChatVideoController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(Ports.FileStorageService)
    private fileStorageService: FileStorageService
  ) {}

  @Get("videos/:video_id")
  async getChatVideo(
    @Req() req: Request,
    @Res() res: Response,
    @Param("chat_id") chatId: string,
    @Param("video_id") videoId: string
  ) {
    const range = req.headers.range;

    const CHUNK_SIZE = 2e6;

    const query = new FindChatVideosQuery({
      chatId,
      byIds: [videoId],
    });

    try {
      const result = await this.queryBus.execute<
        FindChatVideosQuery,
        VideoQueryModel[]
      >(query);

      const video = result?.[0];

      if (!video) return;

      const videoSize = video.file.size;

      const start = range ? Number(range.replace(/\D/g, "")) : 0;
      const end = Math.min(start + CHUNK_SIZE - 1, videoSize - 1);

      const readStream = this.fileStorageService.getChatFileReadStream(
        new ChatId(chatId),
        new FileId(video.file.id),
        {
          start,
          end,
        }
      );

      const contentLength = end - start + 1;

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": video.file.mimetype,
      };

      res.writeHead(206, headers);

      readStream.on("error", () => {
        console.log("Read stream file error");
      });

      readStream.pipe(res);
    } catch (err) {
      console.log("Get Photo controller", err);
    }
  }
}
