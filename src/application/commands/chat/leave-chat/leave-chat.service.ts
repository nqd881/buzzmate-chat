import {Repositories} from "@application/di-tokens/repositories";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {ChatMemberStatusLeft} from "@domain/models/chat-member/chat-member-status/chat-member-status-left";
import {ChatId} from "@domain/models/chat/chat";
import {UserId} from "@domain/models/user/user";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {LeaveChatCommand} from "./leave-chat.command";

@CommandHandler(LeaveChatCommand)
export class LeaveChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo
  ) {}

  async execute(command: LeaveChatCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);

    const chatMember = await this.chatMemberRepo.findOneInChatByUserId(
      chatId,
      userId
    );

    if (!chatMember) throw new Error("Chat member not found");

    chatMember.changeStatus(
      new ChatMemberStatusLeft({
        leaveDate: new Date(),
      })
    );

    await this.chatMemberRepo.save(chatMember);
  }
}
