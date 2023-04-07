import { IChatQueryRepo } from "@application/query-repo/chat-query-repo.interface";
import { QueryRepositories } from "@application/query-repo/constant";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMessagesQuery } from "./find-messages.query";

@QueryHandler(FindMessagesQuery)
export class FindMessagesService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Chat)
    private readonly chatQueryRepo: IChatQueryRepo
  ) {}

  async execute(query: FindMessagesQuery) {
    const {
      metadata: { userId },
      chatId,
      ids,
      limit,
      afterTime,
      beforeTime,
      afterMessageId,
      beforeMessageId,
    } = query;

    const messages = await this.chatQueryRepo.getMessages(userId, chatId, {
      limit,
      byIds: ids,
      byTimeEndpoint: {
        afterTime,
        beforeTime,
      },
      byIdEndpoint: {
        afterMessageId,
        beforeMessageId,
      },
    });

    return messages;
  }
}
