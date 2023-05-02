import { Repositories } from "@application/di-tokens/repositories";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { DomainEventName } from "@domain/utils/domain-event-name";
import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MemberCreatedDomainEvent } from "@domain/models/member/events/member-created";

export class UpdateMemberCount {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo
  ) {}

  @OnEvent(DomainEventName(MemberCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async update(event: MemberCreatedDomainEvent) {
    const { chatId } = event;

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const newMemberCount = await this.memberRepo.countActiveMembersOfChat(
      chatId
    );

    chat.updateMemberCount(newMemberCount);

    this.chatRepo.save(chat);
  }
}
