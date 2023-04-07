import {Message, MessageId} from "@domain/models/message/message";
import {IRepositoryBase} from "@libs/ddd";
import {MaybePromise} from "@libs/utilities/types";
import {ChatId} from "../chat/chat";

export interface IMessageRepo extends IRepositoryBase<Message<any>> {
  findOneOfChatById(
    chatId: ChatId,
    messageId: MessageId
  ): MaybePromise<Message<any>>;

  findManyById(messageIds: MessageId[]): MaybePromise<Message<any>[]>;

  findManyOfChatById(
    chatId: ChatId,
    messageIds: MessageId[]
  ): MaybePromise<Message<any>[]>;
}
