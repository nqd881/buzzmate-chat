import { ChatId } from "@domain/models/chat/chat";
import {
  ChatMember,
  ChatMemberId,
} from "@domain/models/chat-member/chat-member";
import { UserId } from "@domain/models/user/user";
import { IRepositoryBase } from "@libs/ddd";
import { MaybePromise } from "@libs/utilities/types";

export type FindInChatOptions = {
  memberIds?: ChatMemberId[];
};

export interface IChatMemberRepo extends IRepositoryBase<ChatMember> {
  // saveMany(chatMembers: ChatMember[]): Promise<void>;

  findInChat(
    chatId: ChatId,
    options?: FindInChatOptions
  ): MaybePromise<ChatMember[]>;

  findOneInChatByUserId(
    chatId: ChatId,
    userId: UserId
  ): MaybePromise<ChatMember>;

  findManyByUserId(userIds: UserId): MaybePromise<ChatMember[]>;

  countActiveMembersOfChat(chatId: ChatId): MaybePromise<number>;
}
