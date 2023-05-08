import { QueryRepositories } from "@application/query-repo/constant";
import { IPhotoQueryRepo } from "@application/query-repo/photo-query-repo.interface";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindChatPhotosQuery } from "./find-chat-photos.query";

@QueryHandler(FindChatPhotosQuery)
export class FindChatPhotosService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Photo) private photoQueryRepo: IPhotoQueryRepo
  ) {}

  async execute(query: FindChatPhotosQuery) {
    const { chatId, byIds } = query;

    return this.photoQueryRepo.queryChatPhotos({
      chatId,
      byIds,
    });
  }
}
