import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindChatDocumentsQuery } from "./find-chat-documents.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IDocumentQueryRepo } from "@application/query-repo/document-query-repo.interface";

@QueryHandler(FindChatDocumentsQuery)
export class FindChatDocumentsService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Document)
    private documentQueryRepo: IDocumentQueryRepo
  ) {}

  async execute(query: FindChatDocumentsQuery) {
    const { chatId, byIds } = query;

    return this.documentQueryRepo.queryChatDocuments({
      chatId,
      byIds,
    });
  }
}
