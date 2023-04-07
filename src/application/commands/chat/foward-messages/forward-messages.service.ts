import {Repositories} from "@application/di-tokens/repositories";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {ChatId} from "@domain/models/chat/chat";
import {IChatRepo} from "@domain/models/chat/chat-repo.interface";
import {Message, MessageId} from "@domain/models/message/message";
import {MessageForwardInfo} from "@domain/models/message/message-forward-info";
import {IMessageRepo} from "@domain/models/message/message-repo.interface";
import {UserId} from "@domain/models/user/user";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForwardMessagesCommand} from "./forward-messages.command";

@CommandHandler(ForwardMessagesCommand)
export class ForwardMessagesService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo,
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo
  ) {}

  async execute(command: ForwardMessagesCommand) {
    const userId = new UserId(command.metadata.userId);
    const fromChatId = new ChatId(command.fromChatId);
    const toChatId = new ChatId(command.toChatId);
    const messageIds = command.messageIds.map(
      (messageId) => new MessageId(messageId)
    );

    const rootChatMember = await this.chatMemberRepo.findOneInChatByUserId(
      fromChatId,
      userId
    );

    if (!rootChatMember) throw new Error("Root chat member not found");

    const [chat, chatMember] = await Promise.all([
      this.chatRepo.findOneById(toChatId),
      this.chatMemberRepo.findOneInChatByUserId(toChatId, userId),
    ]);

    if (!chat) throw new Error("Chat not found");

    if (!chatMember) throw new Error("Chat member not found");

    const messages = await this.messageRepo.findManyOfChatById(
      fromChatId,
      messageIds
    );

    const fowardMessages = messages.map((message) =>
      Message.create({
        chatId: chat.id,
        senderUserId: chatMember.userId,
        content: message.content.clone(),
        isPinned: false,
        isHidden: false,
        date: new Date(),
        editDate: null,
        replyToMessageId: null,
        forwardInfo: new MessageForwardInfo({
          fromChatId: message.chatId,
          fromMessageId: message.id,
          senderUserId: message.senderUserId,
        }),
        reactions: [],
      })
    );

    await Promise.all(
      fowardMessages.map((forwardMessage) =>
        this.messageRepo.save(forwardMessage)
      )
    );
  }
}
