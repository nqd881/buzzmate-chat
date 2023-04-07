import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { ChatId } from "@domain/models/chat/chat";
import { ChatAdmin } from "@domain/models/chat-admin/chat-admin";
import { UserId } from "@domain/models/user/user";
import { IChatAdminRepo } from "@domain/models/chat-admin/chat-admin-repo.interface";
import { MongoRepository } from "@infrastructure/db/mongo-repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";
import { ChatAdminMapper } from "./chat-admin.mapper";
import { DbChatAdmin } from "./chat-admin.schema";

@Injectable()
export class ChatAdminRepository
  extends MongoRepository<ChatAdmin, DbChatAdmin>
  implements IChatAdminRepo
{
  constructor(
    @InjectModel(DbChatAdmin.name) dbModel: Model<DbChatAdmin>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.ChatAdmin)
    mapper: ChatAdminMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async findOneInChatByUserId(chatId: ChatId, userId: UserId) {
    const doc = await this.dbModel.findOne({
      chatId: chatId.value,
      userId: userId.value,
    });

    return this.mapper.toDomain(doc);
  }
}
