import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {VideoMapper} from "./video.mapper";
import {VideoRepository} from "./video.repository";
import {DbVideo, DbVideoSchema} from "./video.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbVideo.name, schema: DbVideoSchema}]),
  ],
  providers: [
    {provide: Repositories.Video, useClass: VideoRepository},
    {provide: DomainPersistenceMappers.Video, useClass: VideoMapper},
  ],
  exports: [Repositories.Video],
})
export class VideoRepoModule {}
