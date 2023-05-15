import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IRepositoryBase } from "@libs/ddd";
import { MaybePromise } from "@libs/utilities/types";
import { Member, MemberId } from "./member";

export type FindInChatOptions = {
  memberIds?: MemberId[];
  userIds?: UserId[];
};

export interface IMemberRepo extends IRepositoryBase<Member> {
  findMembers(
    chatId: ChatId,
    options?: FindInChatOptions
  ): MaybePromise<Member[]>;

  findMemberByUserId(chatId: ChatId, userId: UserId): MaybePromise<Member>;

  countActiveMembers(chatId: ChatId): MaybePromise<number>;
}
