import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { ChatId } from "@domain/models/chat/chat";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContent } from "@domain/models/message/message-content";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { MongoRepository } from "@infrastructure/db/mongo-repository";
import { MaybePromise } from "@libs/utilities/types";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";
import { MessageMapper } from "./message.mapper";
import { DbMessage } from "./message.schema";

@Injectable()
export class MessageRepository
  extends MongoRepository<Message<MessageContent<any>>, DbMessage>
  implements IMessageRepo
{
  constructor(
    @InjectModel(DbMessage.name) dbModel: Model<DbMessage>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Message)
    mapper: MessageMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async findOneOfChatById(chatId: ChatId, messageId: MessageId) {
    const doc = await this.dbModel.findOne({
      _id: messageId.value,
      chatId: chatId.value,
    });

    return this.mapper.toDomain(doc);
  }

  async findManyById(messageIds: MessageId[]) {
    const docs = await this.dbModel.find({
      _id: messageIds.map((messageId) => messageId.value),
    });

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findManyOfChatById(chatId: ChatId, messageIds: MessageId[]) {
    const docs = await this.dbModel.find({
      _id: messageIds.map((messageId) => messageId.value),
      chatId: chatId.value,
    });

    return docs.map((doc) => this.mapper.toDomain(doc));
  }
}
