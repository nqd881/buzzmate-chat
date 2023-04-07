import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindDocumentsQuery } from "./find-documents.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";

@QueryHandler(FindDocumentsQuery)
export class FindDocumentsService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat) private chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindDocumentsQuery) {
    const { chatId, byIds } = query;

    return this.chatQueryRepo.getPhotos(chatId, {
      byIds,
    });
  }
}
