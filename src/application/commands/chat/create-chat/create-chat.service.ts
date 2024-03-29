import { Repositories } from "@application/di-tokens/repositories";
import { ChatAdmin } from "@domain/models/chat-admin/chat-admin";
import { IChatAdminRepo } from "@domain/models/chat-admin/chat-admin-repo.interface";
import { Member } from "@domain/models/member/member";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { MemberStatusActive } from "@domain/models/member/member-status/member-status-active";
import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { IChatOwnerRepo } from "@domain/models/chat-owner/chat-owner-repo.interface";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { ChatCreatedDomainEvent } from "@domain/models/chat/events/chat-created";
import { UserId } from "@domain/models/user/user";
import { UserScopes } from "@domain/models/user/user-privacy";
import { IUserRepo } from "@domain/models/user/user-repo.interface";
import { ChatDomainService } from "@domain/services/chat";
import {
  DomainEventBusService,
  DynamicDomainEventHandler,
} from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.service";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChatCommand } from "./create-chat.command";
import _ from "lodash";

@CommandHandler(CreateChatCommand)
export class CreateChatService implements ICommandHandler {
  constructor(
    @Inject(Repositories.User) private userRepo: IUserRepo,
    @Inject(Repositories.Chat) private chatRepo: IChatRepo,
    @Inject(Repositories.ChatOwner) private chatOwnerRepo: IChatOwnerRepo,
    @Inject(Repositories.Member) private memberRepo: IMemberRepo,
    @Inject(Repositories.ChatAdmin) private chatAdminRepo: IChatAdminRepo,
    private readonly domainEventBusService: DomainEventBusService
  ) {}

  async execute(command: CreateChatCommand) {
    const userId = new UserId(command.metadata.userId);

    const memberUserIds = _.uniq([
      ...command.memberUserIds,
      command.metadata.userId,
    ]).map((memberUserId) => new UserId(memberUserId));

    const { title, description, accessKey } = command;

    const owner = await this.chatOwnerRepo.findOneByUserId(userId);

    if (!owner) throw new Error("Owner not found");

    const memberUsers = (
      await Promise.all(
        memberUserIds.map((memberUserId) =>
          this.userRepo.findOneById(memberUserId)
        )
      )
    ).filter((memberUser) => {
      if (!memberUser) return false;

      if (memberUser.id.equals(userId)) return true;

      if (!memberUser) return false;

      if (memberUser.privacy.canBeAddedBy === UserScopes.NOBODY) return false;

      return true;
    });

    const newChat = ChatDomainService.createChat(owner, memberUsers, {
      title,
      description,
      ownerId: owner.id,
      accessKey: accessKey ?? null,
      memberCount: memberUsers.length,
    });

    const autoCreateMembersHandler: DynamicDomainEventHandler<
      ChatCreatedDomainEvent
    > = async (event, destroyFn) => {
      const { chatId } = event;

      if (!newChat.id.equals(chatId)) return;

      const members = memberUsers.map((memberUser) =>
        Member.create({
          chatId: newChat.id,
          userId: memberUser.id,
          name: memberUser.name,
          nickname: null,
          joinedDate: new Date(),
          inviterUserId: owner.userId,
          status: new MemberStatusActive(null),
        })
      );

      await this.memberRepo.batchCreate(members);

      destroyFn();
    };

    const autoCreateAdminHandler: DynamicDomainEventHandler<
      ChatCreatedDomainEvent
    > = async (event, destroyFn) => {
      const { chatId } = event;

      if (!newChat.id.equals(chatId)) return;

      const admin = ChatAdmin.create({
        chatId: newChat.id,
        userId,
      });

      await this.chatAdminRepo.save(admin);

      destroyFn();
    };

    this.domainEventBusService.registerDynamicHandler(
      ChatCreatedDomainEvent,
      autoCreateMembersHandler
    );

    if (newChat.isSelf() || newChat.isGroup()) {
      this.domainEventBusService.registerDynamicHandler(
        ChatCreatedDomainEvent,
        autoCreateAdminHandler
      );
    }

    await this.chatRepo.save(newChat);

    return newChat;
  }
}
