import { Module } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";
import { UserQueryRepo } from "./user-query-repo.repository";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.User, useClass: UserQueryRepo },
  ],
  exports: [QueryRepositories.User],
})
export class UserQueryRepoModule {}
