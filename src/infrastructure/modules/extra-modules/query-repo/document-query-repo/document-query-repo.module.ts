import { Module } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import { DocumentQueryRepo } from "./document-query-repo.repository";
import { QueryRepositories } from "@application/query-repo/constant";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.Document, useClass: DocumentQueryRepo },
  ],
  exports: [QueryRepositories.Document],
})
export class DocumentQueryRepoModule {}
