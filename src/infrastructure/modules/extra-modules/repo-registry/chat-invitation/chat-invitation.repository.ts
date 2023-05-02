import { DOMAIN_EVENT_BUS } from "@application/di-tokens/domain-event-bus";
import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Invitation } from "@domain/models/invitation/invitation";
import { IInvitationRepo } from "@domain/models/invitation/invitation-repo.interface";
import { MongoRepository } from "@infrastructure/db/mongo-repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";
import { InvitationMapper } from "./chat-invitation.mapper";
import { DbInvitation } from "./chat-invitation.schema";

@Injectable()
export class InvitationRepository
  extends MongoRepository<Invitation, DbInvitation>
  implements IInvitationRepo
{
  constructor(
    @InjectModel(DbInvitation.name) dbModel: Model<DbInvitation>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Invitation)
    mapper: InvitationMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }
}
