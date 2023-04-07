import { Repositories } from "@application/di-tokens/repositories";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IChatOwnerRepo } from "@domain/models/chat-owner/chat-owner-repo.interface";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LockChatCommand } from "./lock-chat.command";

@CommandHandler(LockChatCommand)
export class LockChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.ChatOwner) private chatOwnerRepo: IChatOwnerRepo,
    @Inject(Repositories.Chat) private chatRepo: IChatRepo
  ) {}

  async execute(command: LockChatCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);

    const owner = await this.chatOwnerRepo.findOneByUserId(userId);

    if (!owner.isOwnerOfChat(chatId))
      throw new Error("User isn't owner of chat");

    const chat = await this.chatRepo.findOneById(chatId);

    chat.lock();

    await this.chatRepo.save(chat);
  }
}
