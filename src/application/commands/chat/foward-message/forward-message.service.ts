import { Repositories } from "@application/di-tokens/repositories";
import { Ports } from "@application/ports/constants";
import {
  IFileStorageService,
  MessageFilePath,
} from "@application/ports/interface/file-storage";
import { ChatId } from "@domain/models/chat/chat";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";

import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageForwardInfo } from "@domain/models/message/message-forward-info";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { UserId } from "@domain/models/user/user";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForwardMessageCommand } from "./forward-message.command";

@CommandHandler(ForwardMessageCommand)
export class ForwardMessageService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo,
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo,

    @Inject(Ports.FileStorageService)
    private readonly fileStorageService: IFileStorageService
  ) {}

  async execute(command: ForwardMessageCommand) {
    const userId = new UserId(command.metadata.userId);
    const fromChatId = new ChatId(command.fromChatId);
    const toChatId = new ChatId(command.toChatId);
    const messageId = new MessageId(command.messageId);

    const rootMember = await this.memberRepo.findMemberByUserId(
      fromChatId,
      userId
    );

    if (!rootMember) throw new Error("Root chat member not found");

    const [chat, member] = await Promise.all([
      this.chatRepo.findOneById(toChatId),
      this.memberRepo.findMemberByUserId(toChatId, userId),
    ]);

    if (!chat) throw new Error("Chat not found");

    if (!member) throw new Error("Member not found");

    const message = await this.messageRepo.findOneById(messageId);

    const newMessage = Message.create({
      chatId: toChatId,
      senderUserId: userId,
      content: message.content.clone(),
      replyToMessageId: null,
      forwardInfo: new MessageForwardInfo({
        fromChatId,
        fromMessageId: messageId,
        senderUserId: message.senderUserId,
      }),
    });

    if (message.content.hasFile()) {
      await this.fileStorageService.copyMessageFile(
        MessageFilePath.fromMessage(message),
        MessageFilePath.fromMessage(newMessage)
      );
    }

    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}
