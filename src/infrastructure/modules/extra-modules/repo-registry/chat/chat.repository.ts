import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Chat, ChatId} from "@domain/models/chat/chat";
import {ChatMemberId} from "@domain/models/chat-member/chat-member";
import {IChatRepo} from "@domain/models/chat/chat-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {ChatMapper} from "./chat.mapper";
import {DbChat} from "./chat.schema";

@Injectable()
export class ChatRepository
  extends MongoRepository<Chat, DbChat>
  implements IChatRepo
{
  constructor(
    @InjectModel(DbChat.name) dbModel: Model<DbChat>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Chat) mapper: ChatMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async addMemberIdToChat(chatId: ChatId, memberId: ChatMemberId) {
    await this.dbModel.findByIdAndUpdate(chatId.value, {
      $push: {
        memberIds: memberId.value,
      },
    });
  }
}
