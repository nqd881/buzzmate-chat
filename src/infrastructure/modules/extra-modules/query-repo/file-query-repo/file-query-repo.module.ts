import { Module } from "@nestjs/common";
import { FileQueryRepo } from "./file-query-repo.repository";
import { MongoUtils } from "../shared/mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.File, useClass: FileQueryRepo },
  ],
  exports: [QueryRepositories.File],
})
export class FileQueryRepoModule {}
