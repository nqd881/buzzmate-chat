import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Photo} from "@domain/models/photo/photo";
import {IPhotoRepo} from "@domain/models/photo/photo-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {PhotoMapper} from "./photo.mapper";
import {DbPhoto} from "./photo.schema";

@Injectable()
export class PhotoRepository
  extends MongoRepository<Photo, DbPhoto>
  implements IPhotoRepo
{
  constructor(
    @InjectModel(DbPhoto.name) dbModel: Model<DbPhoto>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Photo) mapper: PhotoMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }
}
