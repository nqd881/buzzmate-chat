import { Repositories } from "@application/di-tokens/repositories";
import { MemberCreatedDomainEvent } from "@domain/models/member/events/member-created";
import { UserChat } from "@domain/models/user/user-chat";
import { IUserRepo } from "@domain/models/user/user-repo.interface";
import { DomainEventName } from "@domain/utils/domain-event-name";
import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

export class UpdateUserChats {
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo
  ) {}

  @OnEvent(DomainEventName(MemberCreatedDomainEvent), {
    async: true,
    promisify: true,
  })
  async update(event: MemberCreatedDomainEvent) {
    const { userId, chatId } = event;

    const user = await this.userRepo.findOneById(userId);

    if (!user) throw new Error("User not found");

    const newUserChat = new UserChat({
      chatId,
      isFave: false,
      isArchived: false,
    });

    user.addChat(newUserChat);

    await this.userRepo.save(user);
  }
}
