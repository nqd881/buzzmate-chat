import { Module } from "@nestjs/common";
import { VideoQueryRepo } from "./video-query-repo.repository";
import { MongoUtils } from "../mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.Video, useClass: VideoQueryRepo },
  ],
  exports: [QueryRepositories.Video],
})
export class VideoQueryRepoModule {}
