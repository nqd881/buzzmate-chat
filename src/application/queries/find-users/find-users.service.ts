import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUsersQuery } from "./find-users.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";

@QueryHandler(FindUsersQuery)
export class FindUsersService implements IQueryHandler {
  @Inject(QueryRepositories.Chat) private chatQueryRepo: IChatQueryRepo;
  constructor() {}

  async execute(query: FindUsersQuery) {
    const { limit, byIds, byEmails, byNames } = query;

    return this.chatQueryRepo.getUsers({
      limit,
      byIds,
      byEmails,
      byNames,
    });
  }
}
