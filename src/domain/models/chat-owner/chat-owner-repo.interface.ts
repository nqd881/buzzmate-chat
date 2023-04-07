import {ChatOwner} from "@domain/models/chat-owner/chat-owner";
import {UserId} from "@domain/models/user/user";
import {IRepositoryBase} from "@libs/ddd";
import {MaybePromise} from "@libs/utilities/types";

export interface IChatOwnerRepo extends IRepositoryBase<ChatOwner> {
  findOneByUserId(userId: UserId): MaybePromise<ChatOwner>;
}
