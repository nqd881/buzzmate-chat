import {Repositories} from "@application/di-tokens/repositories";
import {MessageId} from "@domain/models/message/message";
import {UserId} from "@domain/models/user/user";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {IMessageRepo} from "@domain/models/message/message-repo.interface";
import {MessageDomainService} from "@domain/services/message";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PinMessagesCommand} from "./pin-messages.command";
import {ChatId} from "@domain/models/chat/chat";

@CommandHandler(PinMessagesCommand)
export class PinMessagesService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo,
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo
  ) {}

  async execute(command: PinMessagesCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const messageIds = command.messageIds.map(
      (messageId) => new MessageId(messageId)
    );
    const {shouldPin} = command;

    const chatMember = await this.chatMemberRepo.findOneInChatByUserId(
      chatId,
      userId
    );

    if (!chatMember) throw new Error("Chat member not found");

    const messages = await this.messageRepo.findManyOfChatById(
      chatId,
      messageIds
    );

    messages.forEach((message) => {
      if (shouldPin) message.pin();
      else message.unpin();
    });

    await Promise.all(
      messages.map((message) => this.messageRepo.save(message))
    );
  }
}
