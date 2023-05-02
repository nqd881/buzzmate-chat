import {
  IVideoQueryRepo,
  QueryVideosOptions,
} from "@application/query-repo/video-query-repo.interface";
import { Injectable } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../common";
import { FileGeneralPipelines } from "../file-query-repo/file-query-repo.repository";
import { isNil } from "lodash";
import { VideoQueryModel } from "@application/query-repo/query-model";
import { HOST } from "../shared";

export const VideoGeneralPipelines = [
  Lookup(
    "dbfiles",
    {
      fileId: "$fileId",
    },
    [Match(Expr(AggOps.Eq("$_id", "$$fileId"))), ...FileGeneralPipelines],
    "__file"
  ),
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
      url: {
        $concat: [
          `http://${HOST}/api/chat-svc/chats/`,
          "$chatId",
          "/videos/",
          "$_id",
        ],
      },
    },
  }),
];

@Injectable()
export class VideoQueryRepo implements IVideoQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryVideos(options?: QueryVideosOptions) {
    const { byIds } = options;

    const videos = await this.mongoUtils
      .getCollection("dbvideos")
      .aggregate(
        [
          Match(Expr(AggOps.In("$_id", byIds))),
          ...VideoGeneralPipelines,
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return videos as VideoQueryModel[];
  }
}
