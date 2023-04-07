import {Repositories} from "@application/di-tokens/repositories";
import {ChatId} from "@domain/models/chat/chat";
import {UserId} from "@domain/models/user/user";
import {IChatMemberRepo} from "@domain/models/chat-member/chat-member-repo.interface";
import {IChatRepo} from "@domain/models/chat/chat-repo.interface";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {EditChatInfoCommand} from "./edit-chat-info.command";

@CommandHandler(EditChatInfoCommand)
export class EditChatInfoService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.ChatMember)
    private readonly chatMemberRepo: IChatMemberRepo
  ) {}

  async execute(command: EditChatInfoCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);

    const {title, description} = command;

    const [chat, chatMember] = await Promise.all([
      this.chatRepo.findOneById(chatId),
      this.chatMemberRepo.findOneInChatByUserId(chatId, userId),
    ]);

    if (!chat) throw new Error("Chat not found");

    if (!chatMember) throw new Error("Chat member not found");

    if (title) chat.editTitle(title);
    if (description) chat.editDescription(description);

    await this.chatRepo.save(chat);
  }
}
