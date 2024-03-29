import { Repositories } from "@application/di-tokens/repositories";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LeaveChatCommand } from "./leave-chat.command";

@CommandHandler(LeaveChatCommand)
export class LeaveChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo
  ) {}

  async execute(command: LeaveChatCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);

    const member = await this.memberRepo.findMemberByUserId(chatId, userId);

    if (!member) throw new Error("Member not found");

    member.updateStatus(
      new MemberStatusLeft({
        leaveDate: new Date(),
      })
    );

    await this.memberRepo.save(member);
  }
}
