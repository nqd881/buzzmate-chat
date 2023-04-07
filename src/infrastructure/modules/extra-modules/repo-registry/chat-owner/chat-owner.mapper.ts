import {ChatId} from "@domain/models/chat/chat";
import {ChatOwner, ChatOwnerId} from "@domain/models/chat-owner/chat-owner";
import {UserId} from "@domain/models/user/user";
import {IDomainPersistenceMapper} from "@libs/ddd";
import {Injectable} from "@nestjs/common";
import {DbChatOwner} from "./chat-owner.schema";

@Injectable()
export class ChatOwnerMapper
  implements IDomainPersistenceMapper<ChatOwner, DbChatOwner>
{
  toPersistence(entity: ChatOwner): DbChatOwner {
    if (!entity) return null;

    const {id, userId, maxCreations, chatIds, version} = entity;

    return {
      _id: id.value,
      userId: userId.value,
      maxCreations,
      chatIds: chatIds.map((chatId) => chatId.value),
      __version: version,
    };
  }

  toDomain(dbModel: DbChatOwner): ChatOwner {
    if (!dbModel) return null;

    const {_id, userId, maxCreations, chatIds, __version} = dbModel;

    return new ChatOwner(
      {
        userId: new UserId(userId),
        maxCreations,
        chatIds: chatIds.map((chatId) => new ChatId(chatId)),
      },
      __version,
      new ChatOwnerId(_id)
    );
  }
}
