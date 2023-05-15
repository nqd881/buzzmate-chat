import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BanMembersCommand } from "./ban-members.command";
import { UserId } from "@domain/models/user/user";
import { MemberId } from "@domain/models/member/member";
import { Inject } from "@nestjs/common";
import { Repositories } from "@application/di-tokens/repositories";
import { IChatAdminRepo } from "@domain/models/chat-admin/chat-admin-repo.interface";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { MemberStatusBanned } from "@domain/models/member/member-status/member-status-banned";

@CommandHandler(BanMembersCommand)
export class BanMembersService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatAdmin) private chatAdminRepo: IChatAdminRepo,
    @Inject(Repositories.Member) private memberRepo: IMemberRepo
  ) {}

  async execute(command: BanMembersCommand) {
    const adminUserId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const memberIds = command.memberIds.map(
      (memberId) => new MemberId(memberId)
    );

    const { reason } = command;

    const admin = await this.chatAdminRepo.findMemberByUserId(
      chatId,
      adminUserId
    );

    if (!admin) throw new Error("Admin not found");

    const members = await this.memberRepo.findMembers(chatId, { memberIds });

    members.forEach((member) => {
      member.updateStatus(
        new MemberStatusBanned({
          bannedDate: new Date(),
          reason,
        })
      );
    });

    await Promise.all(members.map((member) => this.memberRepo.save(member)));
  }
}
