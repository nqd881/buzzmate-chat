import {Repositories} from "@application/di-tokens/repositories";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {ChatId} from "@domain/models/chat/chat";
import {MessageId} from "@domain/models/message/message";
import {IMessageRepo} from "@domain/models/message/message-repo.interface";
import {UserId} from "@domain/models/user/user";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {HideMessagesCommand} from "./hide-messages.command";

@CommandHandler(HideMessagesCommand)
export class HideMessagesService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo,
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo
  ) {}

  async execute(command: HideMessagesCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const messageIds = command.messageIds.map(
      (messageId) => new MessageId(messageId)
    );

    const chatMember = await this.chatMemberRepo.findOneInChatByUserId(
      chatId,
      userId
    );

    if (!chatMember) throw new Error("ChatMember not found");

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
