import {ChatId} from "@domain/models/chat/chat";
import {
  ChatMember,
  ChatMemberId,
  // ChatMemberStatus,
} from "@domain/models/chat-member/chat-member";
import {UserId} from "@domain/models/user/user";
import {IDomainPersistenceMapper} from "@libs/ddd";
import {Injectable} from "@nestjs/common";
import {
  DbChatMember,
  DbChatMemberStatus,
  DbChatMemberStatusActive,
  DbChatMemberStatusBanned,
  DbChatMemberStatusLeft,
} from "./chat-member.schema";
import {ChatMemberStatus} from "@domain/models/chat-member/chat-member-status";
import {ChatMemberStatusActive} from "@domain/models/chat-member/chat-member-status/chat-member-status-active";
import {ChatMemberStatusLeft} from "@domain/models/chat-member/chat-member-status/chat-member-status-left";
import {ChatMemberStatusBanned} from "@domain/models/chat-member/chat-member-status/chat-member-status-banned";

@Injectable()
export class ChatMemberMapper
  implements IDomainPersistenceMapper<ChatMember, DbChatMember>
{
  private statusToPersistence(
    status: ChatMemberStatus<any>
  ): DbChatMemberStatus {
    switch (true) {
      case status instanceof ChatMemberStatusActive: {
        const {type} = status as ChatMemberStatusActive;

        return {
          type,
        } as DbChatMemberStatusActive;
      }
      case status instanceof ChatMemberStatusLeft: {
        const {type, leaveDate} = status as ChatMemberStatusLeft;

        return {
          type,
          leaveDate,
        } as DbChatMemberStatusLeft;
      }
      case status instanceof ChatMemberStatusBanned: {
        const {type, bannedDate, reason} = status as ChatMemberStatusBanned;

        return {
          type,
          bannedDate,
          reason,
        } as DbChatMemberStatusBanned;
      }
    }
  }

  private statusToDomain(status: DbChatMemberStatus): ChatMemberStatus<any> {
    const {type} = status;

    switch (type) {
      case ChatMemberStatusActive.name: {
        return new ChatMemberStatusActive(null);
      }
      case ChatMemberStatusLeft.name: {
        const {leaveDate} = status as DbChatMemberStatusLeft;

        return new ChatMemberStatusLeft({
          leaveDate,
        });
      }
      case ChatMemberStatusBanned.name: {
        const {bannedDate, reason} = status as DbChatMemberStatusBanned;

        return new ChatMemberStatusBanned({
          bannedDate,
          reason,
        });
      }
    }
  }

  toPersistence(entity: ChatMember): DbChatMember {
    if (!entity) return null;

    const {
      id,
      chatId,
      userId,
      name,
      nickname,
      joinedDate,
      inviterUserId,
      status,
      version,
    } = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      userId: userId.value,
      name,
      nickname,
      inviterUserId: inviterUserId.value,
      joinedDate,
      status: this.statusToPersistence(status),
      __version: version,
    };
  }

  toDomain(dbModel: DbChatMember): ChatMember {
    if (!dbModel) return null;

    const {
      _id,
      chatId,
      userId,
      name,
      nickname,
      inviterUserId,
      joinedDate,
      status,
      __version,
    } = dbModel;

    return new ChatMember(
      {
        chatId: new ChatId(chatId),
        userId: new UserId(userId),
        name,
        nickname,
        inviterUserId: new UserId(inviterUserId),
        status: this.statusToDomain(status),
        joinedDate,
      },
      __version,
      new ChatMemberId(_id)
    );
  }
}
