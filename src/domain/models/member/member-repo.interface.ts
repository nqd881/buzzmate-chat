import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IRepositoryBase } from "@libs/ddd";
import { MaybePromise } from "@libs/utilities/types";
import { Member, MemberId } from "./member";

export type FindInChatOptions = {
  memberIds?: MemberId[];
};

export interface IMemberRepo extends IRepositoryBase<Member> {
  findInChat(
    chatId: ChatId,
    options?: FindInChatOptions
  ): MaybePromise<Member[]>;

  findOneInChatByUserId(chatId: ChatId, userId: UserId): MaybePromise<Member>;

  findManyByUserId(userIds: UserId): MaybePromise<Member[]>;

  countActiveMembersOfChat(chatId: ChatId): MaybePromise<number>;
}
