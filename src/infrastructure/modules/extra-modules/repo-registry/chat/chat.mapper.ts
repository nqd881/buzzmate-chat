import {Chat, ChatId, ChatStatus, ChatTypes} from "@domain/models/chat/chat";
import {ChatOwnerId} from "@domain/models/chat-owner/chat-owner";
import {MessageId} from "@domain/models/message/message";
import {IDomainPersistenceMapper} from "@libs/ddd";
import {Injectable} from "@nestjs/common";
import {DbChat} from "./chat.schema";

@Injectable()
export class ChatMapper implements IDomainPersistenceMapper<Chat, DbChat> {
  toPersistence(entity: Chat): DbChat {
    if (!entity) return null;

    const {
      id,
      title,
      description,
      ownerId,
      status,
      lastMessageId,
      type,
      accessKey,
      memberCount,
      version,
    } = entity;

    return {
      _id: id.value,
      title,
      description,
      ownerId: ownerId.value,
      status,
      lastMessageId: lastMessageId?.value ?? null,
      type,
      accessKey,
      memberCount,
      __version: version,
    };
  }

  toDomain(dbModel: DbChat): Chat {
    if (!dbModel) return null;

    const {
      _id,
      title,
      description,
      ownerId,
      status,
      lastMessageId,
      type,
      accessKey,
      memberCount,
      __version,
    } = dbModel;

    return new Chat(
      {
        title,
        description,
        ownerId: new ChatOwnerId(ownerId),
        status: status as ChatStatus,
        lastMessageId: lastMessageId ? new MessageId(lastMessageId) : null,
        type: type as ChatTypes,
        accessKey,
        memberCount,
      },
      __version,
      new ChatId(_id)
    );
  }
}
