import { VideoQueryModel } from "@application/query-repo/query-model";
import {
  IVideoQueryRepo,
  QueryChatVideosOptions,
} from "@application/query-repo/video-query-repo.interface";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { AggOps, Expr, Match } from "../shared/common";
import { MongoUtils } from "../shared/mongo-utils";
import { VideoBasePipeline } from "./pipelines";

@Injectable()
export class VideoQueryRepo implements IVideoQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChatVideos(options?: QueryChatVideosOptions) {
    const { chatId, byIds } = options;

    const videos = await this.mongoUtils
      .getCollection("dbvideos")
      .aggregate(
        [Match(Expr(AggOps.In("$id", byIds))), ...VideoBasePipeline].filter(
          (stage) => !isNil(stage)
        )
      )
      .toArray();

    return videos as VideoQueryModel[];
  }
}
