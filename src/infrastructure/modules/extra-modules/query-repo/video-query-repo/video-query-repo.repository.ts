import { VideoQueryModel } from "@application/query-repo/query-model";
import {
  IVideoQueryRepo,
  QueryChatVideosOptions,
} from "@application/query-repo/video-query-repo.interface";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { isNil } from "lodash";
import {
  AggOps,
  Expr,
  LookupBasic,
  Match,
  Project,
  Unwind,
} from "../shared/common";
import { VIEW_COLLECTION_NAMES } from "../shared/constants";
import { MongoUtils } from "../shared/mongo-utils";

@Injectable()
export class VideoQueryRepo implements IVideoQueryRepo, OnModuleInit {
  constructor(private mongoUtils: MongoUtils) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.VIDEO;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.mongoUtils.getDb().createCollection(collectionName, {
      viewOn: "dbvideos",
      pipeline: [
        LookupBasic(VIEW_COLLECTION_NAMES.FILE, "fileId", "id", "__file"),
        Unwind("$__file"),
        Project({
          Id: false,
          Include: {
            width: 1,
            height: 1,
            duration: 1,
          },
          Fields: {
            id: "$_id",
            file: "$__file",
            url: "",
          },
        }),
      ],
    });
  }

  async queryChatVideos(options?: QueryChatVideosOptions) {
    const { chatId, byIds } = options;

    const videos = await this.mongoUtils
      .getCollection(VIEW_COLLECTION_NAMES.VIDEO)
      .aggregate(
        [Match(Expr(AggOps.In("$id", byIds)))].filter((stage) => !isNil(stage))
      )
      .toArray();

    return videos as VideoQueryModel[];
  }
}
