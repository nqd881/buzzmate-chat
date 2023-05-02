import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindDocumentsQuery } from "./find-documents.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IDocumentQueryRepo } from "@application/query-repo/document-query-repo.interface";
@QueryHandler(FindDocumentsQuery)
export class FindDocumentsService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Document)
    private documentQueryRepo: IDocumentQueryRepo
  ) {}

  async execute(query: FindDocumentsQuery) {
    const { byIds } = query;

    return this.documentQueryRepo.queryDocuments({
      byIds,
    });
  }
}
