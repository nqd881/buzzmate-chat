import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Member } from "@domain/models/member/member";
import {
  FindInChatOptions,
  IMemberRepo,
} from "@domain/models/member/member-repo.interface";
import { MemberStatusActive } from "@domain/models/member/member-status/member-status-active";
import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { MongoRepository } from "@infrastructure/db/mongo-repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";
import { MemberMapper } from "./member.mapper";
import { DbMember } from "./member.schema";

@Injectable()
export class MemberRepository
  extends MongoRepository<Member, DbMember>
  implements IMemberRepo
{
  constructor(
    @InjectModel(DbMember.name) dbModel: Model<DbMember>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Member) mapper: MemberMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async findInChat(chatId: ChatId, options?: FindInChatOptions) {
    const { memberIds } = options;

    const docs = await this.dbModel.find({
      chatId: chatId.value,
      _id: memberIds.map((memberId) => memberId.value),
    });

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findOneInChatByUserId(chatId: ChatId, userId: UserId) {
    const doc = await this.dbModel.findOne({
      chatId: chatId.value,
      userId: userId.value,
    });

    return this.mapper.toDomain(doc);
  }

  async findManyByUserId(userId: UserId) {
    const docs = await this.dbModel.find({
      userId: userId.value,
    });

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async countActiveMembersOfChat(chatId: ChatId) {
    const count = await this.dbModel.countDocuments({
      chatId: chatId.value,
      "status.type": MemberStatusActive.name,
    });

    return count;
  }
}
