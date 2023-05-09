import { Module } from "@nestjs/common";
import { MongoUtils } from "../shared/mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";
import { MessageQueryRepo } from "./message-query-repo.repository";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.Message, useClass: MessageQueryRepo },
  ],
  exports: [QueryRepositories.Message],
})
export class MessageQueryRepoModule {}
