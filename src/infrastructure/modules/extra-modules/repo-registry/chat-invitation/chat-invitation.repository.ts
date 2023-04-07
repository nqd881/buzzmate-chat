import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { ChatInvitation } from "@domain/models/chat-invitation/chat-invitation";
import { IChatInvitationRepo } from "@domain/models/chat-invitation/chat-invitation-repo.interface";
import { MongoRepository } from "@infrastructure/db/mongo-repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";
import { ChatInvitationMapper } from "./chat-invitation.mapper";
import { DbChatInvitation } from "./chat-invitation.schema";

@Injectable()
export class ChatInvitationRepository
  extends MongoRepository<ChatInvitation, DbChatInvitation>
  implements IChatInvitationRepo
{
  constructor(
    @InjectModel(DbChatInvitation.name) dbModel: Model<DbChatInvitation>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.ChatInvitation)
    mapper: ChatInvitationMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }
}
