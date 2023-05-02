import { Module } from "@nestjs/common";
import { PhotoQueryRepo } from "./photo-query-repo.repository";
import { MongoUtils } from "../mongo-utils";

@Module({
  providers: [MongoUtils, PhotoQueryRepo],
  exports: [PhotoQueryRepo],
})
export class PhotoQueryRepoModule {}
