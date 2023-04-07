// import { ChatInvitation } from "@domain/models/chat-invitation";
import { ChatInvitation } from "@domain/models/chat-invitation/chat-invitation";
import { ChatMember } from "@domain/models/chat-member/chat-member";
import { ChatMemberStatusActive } from "@domain/models/chat-member/chat-member-status/chat-member-status-active";
import { ChatOwner } from "@domain/models/chat-owner/chat-owner";
import {
  Chat,
  ChatStatus,
  ChatTypes,
  IChatProps,
} from "@domain/models/chat/chat";
import { User, UserId } from "@domain/models/user/user";
import ms from "ms";

export class ChatDomainService {
  static createChat(
    chatOwner: ChatOwner,
    memberUsers: User[],
    props: Omit<IChatProps, "type" | "status" | "lastMessageId">
  ) {
    if (chatOwner.reachMaxCreations())
      throw new Error("Owner has reached limit count of chats");

    const membersLength = memberUsers.length;

    const type =
      membersLength === 1
        ? ChatTypes.SELF
        : membersLength === 2
        ? ChatTypes.PRIVATE
        : ChatTypes.GROUP;

    return Chat.create({
      ...props,
      status: ChatStatus.ACTIVE,
      lastMessageId: null,
      type,
    });
  }

  static checkAccessKey(chat: Chat, accessKey: string) {
    return chat.accessKey === accessKey;
  }

  static joinChat(chat: Chat, user: User, key?: string) {
    if (!chat.isActive()) throw new Error("Chat is inactive");

    if (chat.isProtected() && !this.checkAccessKey(chat, key))
      throw new Error("Invalid access key");

    const newMember = ChatMember.create({
      chatId: chat.id,
      userId: user.id,
      name: user.name,
      nickname: null,
      joinedDate: new Date(),
      inviterUserId: null,
      status: new ChatMemberStatusActive(null),
    });

    return newMember;
  }

  static createInvitation(
    member: ChatMember,
    chat: Chat,
    invitedUserId: UserId
  ) {
    if (!member.isActive()) throw new Error("Member is inactive");

    if (!chat.isActive()) throw new Error("Chat is inactive");

    if (!chat.isProtected()) throw new Error("Chat is unprotected");

    const newInvitation = ChatInvitation.create({
      inviterUserId: member.userId,
      invitedUserId,
      chatId: chat.id,
      expiredAt: new Date(Date.now() + ms("30d")),
      response: null,
    });

    return newInvitation;
  }
}
