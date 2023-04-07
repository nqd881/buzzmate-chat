import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Video} from "@domain/models/video/video";
import {IVideoRepo} from "@domain/models/video/video-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {VideoMapper} from "./video.mapper";
import {DbVideo} from "./video.schema";

@Injectable()
export class VideoRepository
  extends MongoRepository<Video, DbVideo>
  implements IVideoRepo
{
  constructor(
    @InjectModel(DbVideo.name) dbModel: Model<DbVideo>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.Video) mapper: VideoMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }
}
