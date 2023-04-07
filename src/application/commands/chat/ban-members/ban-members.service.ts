import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BanMembersCommand } from "./ban-members.command";
import { UserId } from "@domain/models/user/user";
import { ChatMemberId } from "@domain/models/chat-member/chat-member";
import { Inject } from "@nestjs/common";
import { Repositories } from "@application/di-tokens/repositories";
import { IChatAdminRepo } from "@domain/models/chat-admin/chat-admin-repo.interface";
import { IChatMemberRepo } from "@domain/models/chat-member/chat-member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { ChatMemberStatusBanned } from "@domain/models/chat-member/chat-member-status/chat-member-status-banned";

@CommandHandler(BanMembersCommand)
export class BanMembersService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatAdmin) private chatAdminRepo: IChatAdminRepo,
    @Inject(Repositories.ChatMember) private chatMemberRepo: IChatMemberRepo
  ) {}

  async execute(command: BanMembersCommand) {
    const adminUserId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const memberIds = command.memberIds.map(
      (memberId) => new ChatMemberId(memberId)
    );

    const { reason } = command;

    const admin = await this.chatAdminRepo.findOneInChatByUserId(
      chatId,
      adminUserId
    );

    if (!admin) throw new Error("Admin not found");

    const members = await this.chatMemberRepo.findInChat(chatId, { memberIds });

    members.forEach((member) => {
      member.changeStatus(
        new ChatMemberStatusBanned({
          bannedDate: new Date(),
          reason,
        })
      );
    });

    await Promise.all(
      members.map((member) => this.chatMemberRepo.save(member))
    );
  }
}
