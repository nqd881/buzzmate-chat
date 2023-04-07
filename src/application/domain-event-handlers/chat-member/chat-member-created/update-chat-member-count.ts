import {Repositories} from "@application/di-tokens/repositories";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {ChatMemberCreatedDomainEvent} from "@domain/models/chat-member/events/chat-member-created";
import {IChatRepo} from "@domain/models/chat/chat-repo.interface";
import {DomainEventName} from "@domain/utils/domain-event-name";
import {Inject} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";

export class UpdateChatMemberCount {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo
  ) {}

  @OnEvent(DomainEventName(ChatMemberCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async update(event: ChatMemberCreatedDomainEvent) {
    const {chatId} = event;

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const newMemberCount = await this.chatMemberRepo.countActiveMembersOfChat(
      chatId
    );

    chat.updateMemberCount(newMemberCount);

    this.chatRepo.save(chat);
  }
}
