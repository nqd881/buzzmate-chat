import {
  InvitationId,
  InvitationResponse,
} from "@domain/models/invitation/invitation";
import { UserId } from "@domain/models/user/user";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReplyToInvitationCommand } from "./reply-to-invitation.command";
import { IInvitationRepo } from "@domain/models/invitation/invitation-repo.interface";
import { Inject } from "@nestjs/common";
import { Repositories } from "@application/di-tokens/repositories";
import { ChatDomainService } from "@domain/services/chat";

@CommandHandler(ReplyToInvitationCommand)
export class ReplyToInvitationService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Invitation)
    private chatInvitationRepo: IInvitationRepo
  ) {}

  async execute(command: ReplyToInvitationCommand) {
    const userId = new UserId(command.metadata.userId);
    const invitationId = new InvitationId(command.invitationId);
    const { accept } = command;

    const invitation = await this.chatInvitationRepo.findOneById(invitationId);

    if (!invitation) throw new Error("Invitation not found");

    if (invitation.invitedUserId.equals(userId)) {
      invitation.updateResponse(
        accept ? InvitationResponse.ACCEPT : InvitationResponse.DECLINE
      );
    }

    await this.chatInvitationRepo.save(invitation);
  }
}
