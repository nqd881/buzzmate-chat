import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindVideosQuery } from "./find-videos.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";
import { VideoQueryModel } from "@application/query-repo/query-model";
import { IVideoQueryRepo } from "@application/query-repo/video-query-repo.interface";

@QueryHandler(FindVideosQuery)
export class FindVideosService
  implements IQueryHandler<FindVideosQuery, VideoQueryModel[]>
{
  constructor(
    @Inject(QueryRepositories.Video) private videoQueryRepo: IVideoQueryRepo
  ) {}

  async execute(query: FindVideosQuery) {
    const { byIds } = query;

    return this.videoQueryRepo.queryVideos({
      byIds,
    });
  }
}
