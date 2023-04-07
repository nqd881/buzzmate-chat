import {
  ChatInvitationId,
  ChatInvitationResponse,
} from "@domain/models/chat-invitation/chat-invitation";
import { UserId } from "@domain/models/user/user";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReplyToInvitationCommand } from "./reply-to-invitation.command";
import { IChatInvitationRepo } from "@domain/models/chat-invitation/chat-invitation-repo.interface";
import { Inject } from "@nestjs/common";
import { Repositories } from "@application/di-tokens/repositories";
import { ChatDomainService } from "@domain/services/chat";

@CommandHandler(ReplyToInvitationCommand)
export class ReplyToInvitationService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatInvitation)
    private chatInvitationRepo: IChatInvitationRepo
  ) {}

  async execute(command: ReplyToInvitationCommand) {
    const userId = new UserId(command.metadata.userId);
    const invitationId = new ChatInvitationId(command.invitationId);
    const { accept } = command;

    const invitation = await this.chatInvitationRepo.findOneById(invitationId);

    if (!invitation) throw new Error("Invitation not found");

    if (invitation.invitedUserId.equals(userId)) {
      invitation.updateResponse(
        accept ? ChatInvitationResponse.ACCEPT : ChatInvitationResponse.DECLINE
      );
    }

    await this.chatInvitationRepo.save(invitation);
  }
}
