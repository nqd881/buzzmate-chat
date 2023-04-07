import { ChatId } from "@domain/models/chat/chat";
import { ChatAdmin } from "@domain/models/chat-admin/chat-admin";
import { UserId } from "@domain/models/user/user";
import { IRepositoryBase } from "@libs/ddd";
import { MaybePromise } from "@libs/utilities/types";

export interface IChatAdminRepo extends IRepositoryBase<ChatAdmin> {
  findOneInChatByUserId(
    chatId: ChatId,
    userId: UserId
  ): MaybePromise<ChatAdmin>;
}
