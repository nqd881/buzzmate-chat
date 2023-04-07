import {Repositories} from "@application/di-tokens/repositories";
import {DomainEventName} from "@domain/utils/domain-event-name";
import {ChatOwner} from "@domain/models/chat-owner/chat-owner";
import {IChatOwnerRepo} from "@domain/models/chat-owner/chat-owner-repo.interface";
import {UserCreatedDomainEvent} from "@domain/models/user/events/user-created";
import {Inject} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";

export class AutoCreateChatOwner {
  constructor(
    @Inject(Repositories.ChatOwner)
    private readonly chatOwnerRepo: IChatOwnerRepo
  ) {}

  @OnEvent(DomainEventName(UserCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async handle(event: UserCreatedDomainEvent) {
    const {userId} = event;

    const newChatOwner = ChatOwner.create({
      userId,
      maxCreations: 30,
      chatIds: [],
    });

    await this.chatOwnerRepo.save(newChatOwner);

    return;
  }
}
