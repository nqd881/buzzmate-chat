import { Module } from "@nestjs/common";
import { PhotoQueryRepo } from "./photo-query-repo.repository";
import { MongoUtils } from "../mongo-utils";
import { QueryRepositories } from "@application/query-repo/constant";

@Module({
  providers: [
    MongoUtils,
    { provide: QueryRepositories.Photo, useClass: PhotoQueryRepo },
  ],
  exports: [QueryRepositories.Photo],
})
export class PhotoQueryRepoModule {}
