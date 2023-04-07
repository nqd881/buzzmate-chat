import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMembersQuery } from "./find-members.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";

@QueryHandler(FindMembersQuery)
export class FindMembersService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat) private chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindMembersQuery) {
    const { userId } = query.metadata;
    const { chatId, byIds, limit } = query;

    return this.chatQueryRepo.getMembers(userId, chatId, {
      byIds,
      limit,
    });
  }
}
