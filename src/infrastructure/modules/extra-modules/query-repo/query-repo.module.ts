import { Module } from "@nestjs/common";
import { ChatQueryRepoModule } from "./chat-query-repo/chat-query-repo.module";
import { MemberQueryRepoModule } from "./member-query-repo/member-query-repo.module";
import { MessageQueryRepoModule } from "./message-query-repo/message-query-repo.module";
import { UserQueryRepoModule } from "./user-query-repo/user-query-repo.module";

const queryRepoModules = [
  UserQueryRepoModule,
  ChatQueryRepoModule,
  MemberQueryRepoModule,
  MessageQueryRepoModule,
];

@Module({
  imports: [...queryRepoModules],
  exports: [...queryRepoModules],
})
export class QueryRepoModule {}
