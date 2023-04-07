import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Document} from "@domain/models/document/document";
import {IDocumentRepo} from "@domain/models/document/document-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {DocumentMapper} from "./document.mapper";
import {DbDocument} from "./document.schema";

@Injectable()
export class DocumentRepository
  extends MongoRepository<Document, DbDocument>
  implements IDocumentRepo
{
  constructor(
    @InjectModel(DbDocument.name) dbModel: Model<DbDocument>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Document) mapper: DocumentMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }
}
