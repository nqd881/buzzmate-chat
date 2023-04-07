import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindPhotosQuery } from "./find-photos.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";

@QueryHandler(FindPhotosQuery)
export class FindPhotosService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat) private chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindPhotosQuery) {
    const { chatId, byIds } = query;

    return this.chatQueryRepo.getPhotos(chatId, {
      byIds,
    });
  }
}
