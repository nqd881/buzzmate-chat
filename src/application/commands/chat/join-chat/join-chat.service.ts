import { Repositories } from "@application/di-tokens/repositories";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { ChatDomainService } from "@domain/services/chat";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JoinChatCommand } from "./join-chat.command";
import { IUserRepo } from "@domain/models/user/user-repo.interface";

@CommandHandler(JoinChatCommand)
export class JoinChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo,
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo
  ) {}

  async execute(command: JoinChatCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const key = command?.key;

    const user = await this.userRepo.findOneById(userId);

    if (!user) throw new Error("User not found");

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const newMember = ChatDomainService.joinChat(chat, user, key);

    await this.memberRepo.save(newMember);

    return newMember;
  }
}
