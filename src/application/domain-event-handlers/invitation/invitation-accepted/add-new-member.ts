import { Repositories } from "@application/di-tokens/repositories";
import { InvitationAcceptedDomainEvent } from "@domain/models/invitation/events/invitation-accepted";
import { IInvitationRepo } from "@domain/models/invitation/invitation-repo.interface";
import { Member } from "@domain/models/member/member";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { MemberStatusActive } from "@domain/models/member/member-status/member-status-active";
import { IUserRepo } from "@domain/models/user/user-repo.interface";
import { DomainEventName } from "@domain/utils/domain-event-name";
import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

export class AddNewMember {
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo,

    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo,

    @Inject(Repositories.Invitation)
    private readonly chatInvitationRepo: IInvitationRepo
  ) {}

  @OnEvent(DomainEventName(InvitationAcceptedDomainEvent), {
    async: true,
    promisify: true,
  })
  async addNewMember(event: InvitationAcceptedDomainEvent) {
    const { invitationId } = event;

    const invitation = await this.chatInvitationRepo.findOneById(invitationId);

    const { chatId, inviterUserId, invitedUserId } = invitation;

    const user = await this.userRepo.findOneById(invitedUserId);

    if (!user) return;

    const member = Member.create({
      chatId,
      userId: invitedUserId,
      name: user.name,
      nickname: "",
      inviterUserId,
      joinedDate: new Date(),
      status: new MemberStatusActive(null),
    });

    this.memberRepo.save(member);
  }
}
