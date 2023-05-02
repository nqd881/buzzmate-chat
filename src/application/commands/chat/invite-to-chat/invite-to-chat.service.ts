import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Inject } from "@nestjs/common";
import { Repositories } from "@application/di-tokens/repositories";
import { UserId } from "@domain/models/user/user";
import { ChatId } from "@domain/models/chat/chat";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { ChatDomainService } from "@domain/services/chat";
import { IInvitationRepo } from "@domain/models/invitation/invitation-repo.interface";
import { InviteToChatCommand } from "./invite-to-chat.command";

@CommandHandler(InviteToChatCommand)
export class InviteToChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo,
    @Inject(Repositories.Invitation)
    private readonly chatInvitationRepo: IInvitationRepo
  ) {}

  async execute(command: InviteToChatCommand) {
    const inviterUserId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const invitedUserIds = command.invitedUserIds.map(
      (invitedUserId) => new UserId(invitedUserId)
    );

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const member = await this.memberRepo.findOneInChatByUserId(
      chatId,
      inviterUserId
    );

    if (!member) throw new Error("Member not found");

    const invitations = invitedUserIds.map((invitedUserId) =>
      ChatDomainService.createInvitation(member, chat, invitedUserId)
    );

    await this.chatInvitationRepo.batchCreate(invitations);
  }
}
