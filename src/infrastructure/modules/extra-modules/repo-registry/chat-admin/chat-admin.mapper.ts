import { ChatId } from "@domain/models/chat/chat";
import { ChatAdmin, ChatAdminId } from "@domain/models/chat-admin/chat-admin";
import { UserId } from "@domain/models/user/user";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbChatAdmin } from "./chat-admin.schema";

@Injectable()
export class ChatAdminMapper
  implements IDomainPersistenceMapper<ChatAdmin, DbChatAdmin>
{
  toPersistence(entity: ChatAdmin): DbChatAdmin {
    if (!entity) return null;

    const { id, chatId, userId, version } = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      userId: userId.value,
      __version: version,
    };
  }

  toDomain(dbModel: DbChatAdmin): ChatAdmin {
    if (!dbModel) return null;

    const { _id, chatId, userId, __version } = dbModel;

    return new ChatAdmin(
      {
        chatId: new ChatId(chatId),
        userId: new UserId(userId),
      },
      __version,
      new ChatAdminId(_id)
    );
  }
}
