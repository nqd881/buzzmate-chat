import { Repositories } from "@application/di-tokens/repositories";
import { ChatInvitationId } from "@domain/models/chat-invitation/chat-invitation";
import { IChatInvitationRepo } from "@domain/models/chat-invitation/chat-invitation-repo.interface";
import { ChatInvitationAcceptedDomainEvent } from "@domain/models/chat-invitation/events/chat-invitation-accepted";
import { ChatMember } from "@domain/models/chat-member/chat-member";
import { IChatMemberRepo } from "@domain/models/chat-member/chat-member-repo.interface";
import { ChatMemberStatusActive } from "@domain/models/chat-member/chat-member-status/chat-member-status-active";
import { IUserRepo } from "@domain/models/user/user-repo.interface";
import { DomainEventName } from "@domain/utils/domain-event-name";
import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

export class AddNewMember {
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo,

    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo,

    @Inject(Repositories.ChatInvitation)
    private readonly chatInvitationRepo: IChatInvitationRepo
  ) {}

  @OnEvent(DomainEventName(ChatInvitationAcceptedDomainEvent), {
    async: true,
    promisify: true,
  })
  async addNewMember(event: ChatInvitationAcceptedDomainEvent) {
    const { invitationId } = event;

    const invitation = await this.chatInvitationRepo.findOneById(invitationId);

    const { chatId, inviterUserId, invitedUserId } = invitation;

    const user = await this.userRepo.findOneById(invitedUserId);

    if (!user) return;

    const member = ChatMember.create({
      chatId,
      userId: invitedUserId,
      name: user.name,
      nickname: "",
      inviterUserId,
      joinedDate: new Date(),
      status: new ChatMemberStatusActive(null),
    });

    this.chatMemberRepo.save(member);
  }
}
