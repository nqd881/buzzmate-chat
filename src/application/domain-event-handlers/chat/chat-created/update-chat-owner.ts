import {Repositories} from "@application/di-tokens/repositories";
import {ChatCreatedDomainEvent} from "@domain/models/chat/events/chat-created";
import {DomainEventName} from "@domain/utils/domain-event-name";
import {IChatOwnerRepo} from "@domain/models/chat-owner/chat-owner-repo.interface";
import {Inject} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";

export class UpdateChatOwner {
  constructor(
    @Inject(Repositories.ChatOwner)
    private readonly chatOwnerRepo: IChatOwnerRepo
  ) {}

  @OnEvent(DomainEventName(ChatCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async update(event: ChatCreatedDomainEvent) {
    const {chatId, ownerId} = event;

    const chatOwner = await this.chatOwnerRepo.findOneById(ownerId);

    chatOwner.addChatId(chatId);

    this.chatOwnerRepo.save(chatOwner);
  }
}
