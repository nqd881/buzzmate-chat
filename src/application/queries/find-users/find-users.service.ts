import { QueryRepositories } from "@application/query-repo/constant";
import { IUserQueryRepo } from "@application/query-repo/user-query-repo.interface";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUsersQuery } from "./find-users.query";

@QueryHandler(FindUsersQuery)
export class FindUsersService implements IQueryHandler {
  @Inject(QueryRepositories.User) private userQueryRepo: IUserQueryRepo;
  constructor() {}

  async execute(query: FindUsersQuery) {
    const { limit, byIds, byEmails, byNames } = query;

    return this.userQueryRepo.queryUsers({
      limit,
      byIds,
      byEmails,
      byNames,
    });
  }
}
