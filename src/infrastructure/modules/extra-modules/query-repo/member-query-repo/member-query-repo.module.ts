import { Module } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";
import { MemberQueryRepo } from "./member-query-repo.repository";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.Member, useClass: MemberQueryRepo },
  ],
  exports: [QueryRepositories.Member],
})
export class MemberQueryRepoModule {}
