import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbChatInvitation } from "./chat-invitation.schema";
import {
  ChatInvitation,
  ChatInvitationId,
  ChatInvitationResponse,
} from "@domain/models/chat-invitation/chat-invitation";

@Injectable()
export class ChatInvitationMapper
  implements IDomainPersistenceMapper<ChatInvitation, DbChatInvitation>
{
  toPersistence(entity: ChatInvitation): DbChatInvitation {
    if (!entity) return null;

    const {
      id,
      chatId,
      inviterUserId,
      invitedUserId,
      expiredAt,
      response,
      version,
    } = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      inviterUserId: inviterUserId.value,
      invitedUserId: invitedUserId.value,
      expiredAt,
      response,
      __version: version,
    };
  }

  toDomain(dbModel: DbChatInvitation): ChatInvitation {
    if (!dbModel) return null;

    const {
      _id,
      chatId,
      inviterUserId,
      invitedUserId,
      expiredAt,
      response,
      __version,
    } = dbModel;

    return new ChatInvitation(
      {
        chatId: new ChatId(chatId),
        inviterUserId: new UserId(inviterUserId),
        invitedUserId: new UserId(invitedUserId),
        expiredAt,
        response: response as ChatInvitationResponse,
      },
      __version,
      new ChatInvitationId(_id)
    );
  }
}
