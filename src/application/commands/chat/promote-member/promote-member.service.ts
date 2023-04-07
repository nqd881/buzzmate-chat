import { Repositories } from "@application/di-tokens/repositories";
import { ChatAdmin } from "@domain/models/chat-admin/chat-admin";
import { IChatAdminRepo } from "@domain/models/chat-admin/chat-admin-repo.interface";
import { ChatMemberId } from "@domain/models/chat-member/chat-member";
import { IChatMemberRepo } from "@domain/models/chat-member/chat-member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PromoteMemberCommand } from "./promote-member.command";

@CommandHandler(PromoteMemberCommand)
export class PromoteMemberService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatAdmin)
    private readonly chatAdminRepo: IChatAdminRepo,
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo
  ) {}

  async execute(command: PromoteMemberCommand) {
    const adminUserId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const memberId = new ChatMemberId(command.memberId);

    const [admin, member] = await Promise.all([
      this.chatAdminRepo.findOneInChatByUserId(chatId, adminUserId),
      this.chatMemberRepo.findOneById(memberId),
    ]);

    if (!admin) throw new Error("Admin not found");

    if (!member) throw new Error("Member not found");

    const existAdmin = await this.chatAdminRepo.findOneInChatByUserId(
      chatId,
      member.userId
    );

    if (existAdmin) throw new Error("Cannot promote an admin");

    const newAdmin = ChatAdmin.create({
      chatId,
      userId: member.userId,
    });

    await this.chatAdminRepo.save(newAdmin);
  }
}
