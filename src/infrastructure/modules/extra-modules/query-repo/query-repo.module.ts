import {Module} from "@nestjs/common";
import {ChatQueryRepoModule} from "./chat-query-repo/chat-query-repo.module";

@Module({
  imports: [ChatQueryRepoModule],
  exports: [ChatQueryRepoModule],
})
export class QueryRepoModule {}
