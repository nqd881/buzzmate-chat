import { Repositories } from "@application/di-tokens/repositories";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { MessageId } from "@domain/models/message/message";
import { MessageReaction } from "@domain/models/message/message-reaction";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { UserId } from "@domain/models/user/user";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendReactionCommand } from "./send-reaction.command";

@CommandHandler(SendReactionCommand)
export class SendReactionService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo
  ) {}

  async execute(command: SendReactionCommand) {
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const messageId = new MessageId(command.messageId);
    const reactionValue = command?.reactionValue;

    const member = await this.memberRepo.findMemberByUserId(chatId, userId);

    if (!member) throw new Error("Member not found");

    const message = await this.messageRepo.findOneOfChatById(chatId, messageId);

    if (!message) throw new Error("Message not found");

    message.addReaction(
      new MessageReaction({
        memberId: member.id,
        reactionValue,
      })
    );

    await this.messageRepo.save(message);
  }
}
