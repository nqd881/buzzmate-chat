import {Repositories} from "@application/di-tokens/repositories";
import {DomainEventName} from "@domain/utils/domain-event-name";
import {MessageCreatedDomainEvent} from "@domain/models/message/events/message-created";
import {IChatRepo} from "@domain/models/chat/chat-repo.interface";
import {Inject} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";

export class UpdateChatLastMessage {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo
  ) {}

  @OnEvent(DomainEventName(MessageCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async updateChatLastMessage(event: MessageCreatedDomainEvent) {
    const {chatId, messageId} = event;

    const chat = await this.chatRepo.findOneById(chatId);

    chat.updateLastMessageId(messageId);

    this.chatRepo.save(chat);
  }
}
