import { ChatId } from "@domain/models/chat/chat";
import { Member, MemberId } from "@domain/models/member/member";
import { UserId } from "@domain/models/user/user";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import {
  DbChatMember,
  DbChatMemberStatus,
  DbChatMemberStatusActive,
  DbChatMemberStatusBanned,
  DbChatMemberStatusLeft,
} from "./chat-member.schema";
import { MemberStatus } from "@domain/models/member/member-status";
import { MemberStatusActive } from "@domain/models/member/member-status/member-status-active";
import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { MemberStatusBanned } from "@domain/models/member/member-status/member-status-banned";

@Injectable()
export class ChatMemberMapper
  implements IDomainPersistenceMapper<Member, DbChatMember>
{
  private statusToPersistence(status: MemberStatus<any>): DbChatMemberStatus {
    switch (true) {
      case status instanceof MemberStatusActive: {
        const { type } = status as MemberStatusActive;

        return {
          type,
        } as DbChatMemberStatusActive;
      }
      case status instanceof MemberStatusLeft: {
        const { type, leaveDate } = status as MemberStatusLeft;

        return {
          type,
          leaveDate,
        } as DbChatMemberStatusLeft;
      }
      case status instanceof MemberStatusBanned: {
        const { type, bannedDate, reason } = status as MemberStatusBanned;

        return {
          type,
          bannedDate,
          reason,
        } as DbChatMemberStatusBanned;
      }
    }
  }

  private statusToDomain(status: DbChatMemberStatus): MemberStatus<any> {
    const { type } = status;

    switch (type) {
      case MemberStatusActive.name: {
        return new MemberStatusActive(null);
      }
      case MemberStatusLeft.name: {
        const { leaveDate } = status as DbChatMemberStatusLeft;

        return new MemberStatusLeft({
          leaveDate,
        });
      }
      case MemberStatusBanned.name: {
        const { bannedDate, reason } = status as DbChatMemberStatusBanned;

        return new MemberStatusBanned({
          bannedDate,
          reason,
        });
      }
    }
  }

  toPersistence(entity: Member): DbChatMember {
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

  toDomain(dbModel: DbChatMember): Member {
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

    return new Member(
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
      new MemberId(_id)
    );
  }
}
