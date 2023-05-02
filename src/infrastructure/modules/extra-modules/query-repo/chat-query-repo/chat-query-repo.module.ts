import { QueryRepositories } from "@application/query-repo/constant";
import { Module } from "@nestjs/common";
import { ChatQueryRepo } from "./chat-query-repo.repository";
import { MongoUtils } from "../mongo-utils";

@Module({
  imports: [],
  providers: [
    MongoUtils,
    {
      provide: QueryRepositories.Chat,
      useClass: ChatQueryRepo,
    },
  ],
  exports: [QueryRepositories.Chat],
})
export class ChatQueryRepoModule {}
