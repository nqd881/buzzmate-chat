import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {ChatOwner} from "@domain/models/chat-owner/chat-owner";
import {UserId} from "@domain/models/user/user";
import {IChatOwnerRepo} from "@domain/models/chat-owner/chat-owner-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {ChatOwnerMapper} from "./chat-owner.mapper";
import {DbChatOwner} from "./chat-owner.schema";

@Injectable()
export class ChatOwnerRepository
  extends MongoRepository<ChatOwner, DbChatOwner>
  implements IChatOwnerRepo
{
  constructor(
    @InjectModel(DbChatOwner.name) dbModel: Model<DbChatOwner>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.ChatOwner) mapper: ChatOwnerMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async findOneByUserId(userId: UserId) {
    const chatOwner = await this.dbModel.findOne({
      userId: userId.value,
    });

    return this.mapper.toDomain(chatOwner);
  }
}
