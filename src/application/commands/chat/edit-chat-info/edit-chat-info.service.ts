import { Repositories } from "@application/di-tokens/repositories";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EditChatInfoCommand } from "./edit-chat-info.command";

@CommandHandler(EditChatInfoCommand)
export class EditChatInfoService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo
  ) {}

  async execute(command: EditChatInfoCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);

    const { title, description } = command;

    const [chat, member] = await Promise.all([
      this.chatRepo.findOneById(chatId),
      this.memberRepo.findOneInChatByUserId(chatId, userId),
    ]);

    if (!chat) throw new Error("Chat not found");

    if (!member) throw new Error("Member not found");

    if (title) chat.editTitle(title);
    if (description) chat.editDescription(description);

    await this.chatRepo.save(chat);
  }
}
