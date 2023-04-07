import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";
import { QueryRepositories } from "@application/query-repo/constant";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindChatsQuery } from "./find-chats.query";

@QueryHandler(FindChatsQuery)
export class FindChatsService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat)
    private readonly chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindChatsQuery) {
    const { userId } = query.metadata;

    const { byIds, limit, fave, archived } = query;

    const chats = await this.chatQueryRepo.getChats(userId, {
      byIds,
      limit,
      fave,
      archived,
    });

    return chats || [];
  }
}
