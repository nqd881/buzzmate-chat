import { QueryRepositories } from "@application/query-repo/constant";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMessagesQuery } from "./find-messages.query";
import { IMessageQueryRepo } from "@application/query-repo/message-query-repo.interface";
@QueryHandler(FindMessagesQuery)
export class FindMessagesService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Message)
    private readonly messageQueryRepo: IMessageQueryRepo
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

    const messages = await this.messageQueryRepo.queryMessages(userId, {
      chatId,
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
