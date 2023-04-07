import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindVideosQuery } from "./find-videos.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";

@QueryHandler(FindVideosQuery)
export class FindVideosService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat) private chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindVideosQuery) {
    const { chatId, byIds } = query;

    return this.chatQueryRepo.getVideos(chatId, {
      byIds,
    });
  }
}
