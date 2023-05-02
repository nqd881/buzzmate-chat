import { Repositories } from "@application/di-tokens/repositories";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { MessageId } from "@domain/models/message/message";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { UserId } from "@domain/models/user/user";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { HideMessagesCommand } from "./hide-messages.command";

@CommandHandler(HideMessagesCommand)
export class HideMessagesService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo,
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo
  ) {}

  async execute(command: HideMessagesCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const messageIds = command.messageIds.map(
      (messageId) => new MessageId(messageId)
    );

    const member = await this.memberRepo.findOneInChatByUserId(chatId, userId);

    if (!member) throw new Error("Member not found");

    const messages = await this.messageRepo.findManyOfChatById(
      chatId,
      messageIds
    );

    messages.forEach((message) => {
      message.hide();
    });

    await Promise.all(
      messages.map((message) => this.messageRepo.save(message))
    );
  }
}
