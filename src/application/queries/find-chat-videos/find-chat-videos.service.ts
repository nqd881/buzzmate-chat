import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindChatVideosQuery } from "./find-chat-videos.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { VideoQueryModel } from "@application/query-repo/query-model";
import { IVideoQueryRepo } from "@application/query-repo/video-query-repo.interface";

@QueryHandler(FindChatVideosQuery)
export class FindChatVideosService
  implements IQueryHandler<FindChatVideosQuery, VideoQueryModel[]>
{
  constructor(
    @Inject(QueryRepositories.Video) private videoQueryRepo: IVideoQueryRepo
  ) {}

  async execute(query: FindChatVideosQuery) {
    const { chatId, byIds } = query;

    return this.videoQueryRepo.queryChatVideos({
      chatId,
      byIds,
    });
  }
}
